import configPromise from "@payload-config";
import { NextResponse } from "next/server";
import type { Payload } from "payload";
import { getPayload } from "payload";
import { Resend } from "resend";
import type { Contact } from "@/payload-types";

const resend = new Resend(process.env.RESEND_API_KEY);

// Prevent prerendering for API routes that use request.url
export const dynamic = "force-dynamic";

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Route handler needs multiple validation and error handling steps
export async function GET(request: Request) {
  let logger: Payload["logger"] | undefined;
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const payload = await getPayload({ config: configPromise });
    logger = payload.logger;
    const logInfo = (message: string) => {
      logger?.info?.(message);
    };
    const logWarn = (message: string) => {
      logger?.warn?.(message);
    };
    const logError = (message: string, detail?: unknown) => {
      const errorMessage = detail
        ? `${message} ${detail instanceof Error ? detail.message : String(detail)}`
        : message;
      logger?.error?.(errorMessage);
    };

    if (!token) {
      logWarn("[Confirm] No token provided");
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }
    logInfo("[Confirm] Processing confirmation request");

    // Find contact by token
    const contacts = await payload.find({
      collection: "contacts",
      where: {
        confirmationToken: { equals: token },
        status: { equals: "pending" },
      },
      limit: 1,
      showHiddenFields: true, // Include hidden fields (confirmationToken, confirmationExpiry)
    });

    if (!contacts.docs.length) {
      logWarn("[Confirm] Invalid or expired token");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const contact = contacts.docs[0] as Contact;
    logInfo(
      `[Confirm] Found contact: ${contact.email}, status: ${contact.status}, expiry: ${contact.confirmationExpiry}`
    );

    // Check if token is expired
    if (!contact.confirmationExpiry) {
      return NextResponse.json(
        { error: "Invalid confirmation data" },
        { status: 400 }
      );
    }

    if (new Date(contact.confirmationExpiry) < new Date()) {
      return NextResponse.json(
        { error: "Confirmation link has expired" },
        { status: 400 }
      );
    }

    // Check if already confirmed (idempotency)
    if (contact.status === "active" && contact.resendContactId) {
      logInfo(`[Confirm] Contact ${contact.email} already confirmed`);
      return NextResponse.redirect(
        new URL("/subscription-confirmed", request.url)
      );
    }

    // Validate required environment variable
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create contact in Resend with error handling
    let resendContactId: string | undefined;
    try {
      const resendContact = await resend.contacts.create({
        email: contact.email,
        firstName: contact.firstName || undefined,
        lastName: contact.lastName || undefined,
        unsubscribed: false,
        audienceId,
      });

      resendContactId = resendContact.data?.id;

      // Check for API errors
      if (resendContact.error) {
        logError("[Confirm] Resend API error", resendContact.error);
        // If contact already exists, that's okay - just update our database
        const errorMessage = resendContact.error.message?.toLowerCase() || "";
        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate")
        ) {
          logInfo(
            `[Confirm] Contact ${contact.email} already exists in Resend - continuing`
          );
          // Try to find existing Resend contact ID
          // (In production, you might want to call resend.contacts.get() here)
        } else {
          throw new Error(resendContact.error.message);
        }
      }
    } catch (error) {
      logError("[Confirm] Failed to create contact in Resend", error);
      // Continue anyway - we can sync later via webhook
      // Don't block user confirmation due to Resend issues
    }

    // Update contact in database
    await payload.update({
      collection: "contacts",
      id: contact.id,
      data: {
        status: "active",
        resendContactId: resendContactId || contact.resendContactId,
        confirmationToken: null,
        confirmationExpiry: null,
      },
    });

    logInfo(`[Confirm] Successfully confirmed ${contact.email}`);

    // Redirect to success page
    return NextResponse.redirect(
      new URL("/subscription-confirmed", request.url)
    );
  } catch (_error) {
    logger?.error?.(
      `[Confirm] Error: ${_error instanceof Error ? _error.message : String(_error)}`
    );
    return NextResponse.json(
      { error: "Failed to confirm subscription" },
      { status: 500 }
    );
  }
}
