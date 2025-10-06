import configPromise from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { Resend } from "resend";
import type { Contact } from "@/payload-types";

const resend = new Resend(process.env.RESEND_API_KEY);

// Prevent prerendering for API routes that use request.url
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // Find contact by token
    const contacts = await payload.find({
      collection: "contacts",
      where: {
        confirmationToken: { equals: token },
        status: { equals: "pending" },
      },
      limit: 1,
    });

    if (!contacts.docs.length) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const contact = contacts.docs[0] as Contact;

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

    // Validate required environment variable
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create contact in Resend
    const resendContact = await resend.contacts.create({
      email: contact.email,
      firstName: contact.firstName || undefined,
      lastName: contact.lastName || undefined,
      unsubscribed: false,
      audienceId,
    });

    // Update contact in database
    await payload.update({
      collection: "contacts",
      id: contact.id,
      data: {
        status: "active",
        resendContactId: resendContact.data?.id,
        confirmationToken: null,
        confirmationExpiry: null,
      },
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL("/subscription-confirmed", request.url)
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to confirm subscription" },
      { status: 500 }
    );
  }
}
