"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { z } from "zod";
import { getSubscriptionConfirmationEmail } from "@/emails/subscription-confirmation";
import type { Contact } from "@/payload-types";
import { generateToken } from "@/utilities/generateToken";

const contactSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().optional(),
});

export type ActionResponse = {
  success: boolean;
  message: string;
  contact?: Contact;
  errors?: Record<string, string>;
};

export async function createContactAction(
  _prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const payload = await getPayload({ config: configPromise });
    const logInfo = (message: string) => {
      if (payload.logger?.info) {
        payload.logger.info(message);
      }
    };

    // Validate input
    const result = contactSchema.safeParse({
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    });

    if (!result.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: Object.fromEntries(
          Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [
            k,
            v?.[0] || "",
          ])
        ),
      };
    }

    const { email, firstName, lastName } = result.data;

    // Check existing contact
    const existingContact = await payload.find({
      collection: "contacts",
      where: { email: { equals: email } },
      limit: 1,
    });

    if (existingContact.docs.length) {
      const contact = existingContact.docs[0] as Contact;

      logInfo(
        `[Subscribe] Found existing contact: ${email}, status: ${contact.status}`
      );

      // If already active and confirmed, they're subscribed
      if (contact.status === "active") {
        return {
          success: true, // Changed to true - not an error!
          message:
            "You're already subscribed! Check your inbox for our latest emails.",
          contact,
        };
      }

      // If pending or unsubscribed, allow re-subscription
      if (contact.status === "pending" || contact.status === "unsubscribed") {
        logInfo(`[Subscribe] Re-subscribing ${email} (was ${contact.status})`);

        // Generate new confirmation token
        const confirmationToken = generateToken();
        const confirmationExpiry = new Date();
        confirmationExpiry.setHours(confirmationExpiry.getHours() + 24);

        // Update existing contact with new token
        const updatedContact = await payload.update({
          collection: "contacts",
          id: contact.id,
          data: {
            firstName,
            lastName,
            status: "pending",
            confirmationToken,
            confirmationExpiry: confirmationExpiry.toISOString(),
            subscribedAt: new Date().toISOString(),
            // Clear old Resend ID if unsubscribed (will be regenerated on confirmation)
            ...(contact.status === "unsubscribed" && { resendContactId: null }),
          },
        });

        // Send fresh confirmation email
        const { html: resubscribeHtml, subject: resubscribeSubject } =
          await getSubscriptionConfirmationEmail({
            firstName,
            confirmationToken,
          });

        await payload.sendEmail({
          to: email,
          from: "notifications@mail.lyovson.com",
          subject: resubscribeSubject,
          html: resubscribeHtml,
        });

        logInfo(`[Subscribe] Sent confirmation email to ${email}`);

        return {
          success: true,
          message: "Please check your email to confirm your subscription.",
          contact: updatedContact as Contact,
        };
      }
    }

    // If no existing contact, create new one
    logInfo(`[Subscribe] Creating new contact: ${email}`);

    // Generate confirmation token
    const confirmationToken = generateToken();
    const confirmationExpiry = new Date();
    confirmationExpiry.setHours(confirmationExpiry.getHours() + 24);

    // Create contact
    const contact = await payload.create({
      collection: "contacts",
      data: {
        email,
        firstName,
        lastName,
        status: "pending",
        subscribedAt: new Date().toISOString(),
        confirmationToken,
        confirmationExpiry: confirmationExpiry.toISOString(),
      },
    });

    // Send confirmation email
    const {
      html: initialConfirmationHtml,
      subject: initialConfirmationSubject,
    } = await getSubscriptionConfirmationEmail({
      firstName,
      confirmationToken,
    });

    await payload.sendEmail({
      to: email,
      from: "notifications@mail.lyovson.com",
      subject: initialConfirmationSubject,
      html: initialConfirmationHtml,
    });

    logInfo(`[Subscribe] Sent confirmation email to ${email}`);

    return {
      success: true,
      message: "Please check your email to confirm your subscription.",
      contact: contact as Contact,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
