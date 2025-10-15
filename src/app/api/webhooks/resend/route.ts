import configPromise from "@payload-config";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { Webhook } from "svix";
import { WelcomeEmail } from "@/emails/welcome-email";
import { getServerSideURL } from "@/utilities/getURL";

// Prevent prerendering for webhook endpoints
export const dynamic = "force-dynamic";

type ResendWebhookEvent = {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    email?: string;
    from?: string;
    to?: string[];
    subject?: string;
    created_at?: string;
    // Contact events
    id?: string;
    first_name?: string;
    last_name?: string;
    unsubscribed?: boolean;
    audience_id?: string;
  };
};

export async function POST(request: Request) {
  try {
    // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
    console.log("[Webhook] Received Resend webhook request");

    // Verify webhook signature
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (!webhookSecret) {
      // biome-ignore lint/suspicious/noConsole: Server-side error logging
      console.error("[Webhook] RESEND_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get raw body and headers for verification
    const body = await request.text();
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!(svixId && svixTimestamp && svixSignature)) {
      // biome-ignore lint/suspicious/noConsole: Server-side error logging
      console.error("[Webhook] Missing svix headers");
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 401 }
      );
    }

    // Verify the webhook using Svix
    const wh = new Webhook(webhookSecret);
    let event: ResendWebhookEvent;

    try {
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ResendWebhookEvent;
      // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
      console.log(`[Webhook] Verified event type: ${event.type}`);
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Server-side error logging
      console.error("[Webhook] Verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Get Payload instance
    const payload = await getPayload({ config: configPromise });

    // Handle different event types
    switch (event.type) {
      // Email events
      case "email.bounced":
      case "email.complained":
        try {
          if (event.data.email) {
            await payload.update({
              collection: "contacts",
              where: { email: { equals: event.data.email } },
              data: { status: "unsubscribed" },
            });
            // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
            console.log(
              `[Webhook] Marked ${event.data.email} as unsubscribed due to ${event.type}`
            );
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: Server-side error logging
          console.error(`[Webhook] Error handling ${event.type}:`, error);
        }
        break;

      // Contact events (new in 2024!)
      case "contact.created":
        try {
          // Send welcome email when contact is created in Resend
          if (event.data.email && event.data.first_name) {
            // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
            console.log(
              `[Webhook] Processing contact.created for ${event.data.email}`
            );

            const welcomeHtml = await render(
              WelcomeEmail({
                firstName: event.data.first_name,
                siteUrl: getServerSideURL(),
              }),
              {
                pretty: false,
              }
            );

            await payload.sendEmail({
              to: event.data.email,
              from: "notifications@mail.lyovson.com",
              subject: "Welcome to Lyovson.com!",
              html: welcomeHtml,
            });

            // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
            console.log(`[Webhook] Sent welcome email to ${event.data.email}`);
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: Server-side error logging
          console.error("[Webhook] Error handling contact.created:", error);
        }
        break;

      case "contact.updated":
        try {
          // Sync unsubscribe status
          if (event.data.email && event.data.unsubscribed !== undefined) {
            // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
            console.log(
              `[Webhook] Processing contact.updated for ${event.data.email}`
            );

            await payload.update({
              collection: "contacts",
              where: { email: { equals: event.data.email } },
              data: {
                status: event.data.unsubscribed ? "unsubscribed" : "active",
                unsubscribed: event.data.unsubscribed,
              },
            });

            // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
            console.log(
              `[Webhook] Updated ${event.data.email} subscription status to ${event.data.unsubscribed ? "unsubscribed" : "active"}`
            );
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: Server-side error logging
          console.error("[Webhook] Error handling contact.updated:", error);
        }
        break;

      case "contact.deleted":
        try {
          // Mark as deleted in database (soft delete)
          if (event.data.email) {
            // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
            console.log(
              `[Webhook] Processing contact.deleted for ${event.data.email}`
            );

            await payload.update({
              collection: "contacts",
              where: { email: { equals: event.data.email } },
              data: {
                status: "unsubscribed",
                resendContactId: null,
              },
            });

            // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
            console.log(`[Webhook] Marked ${event.data.email} as deleted`);
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: Server-side error logging
          console.error("[Webhook] Error handling contact.deleted:", error);
        }
        break;

      default:
        // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    // biome-ignore lint/suspicious/noConsole: Server-side logging for debugging
    console.log("[Webhook] Successfully processed webhook");
    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Server-side error logging
    console.error("[Webhook] Processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
