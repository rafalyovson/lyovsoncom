import { render } from "@react-email/render";
import { SubscriptionConfirmationEmail } from "@/emails/subscription-confirmation-email";
import { getServerSideURL } from "@/utilities/getURL";

const SITE_NAME = "Lyovson.com";

type ConfirmationEmailProps = {
  firstName: string;
  confirmationToken: string;
};

export async function getSubscriptionConfirmationEmail({
  firstName,
  confirmationToken,
}: ConfirmationEmailProps): Promise<{ html: string; subject: string }> {
  const confirmUrl = `${getServerSideURL()}/api/confirm-subscription?token=${confirmationToken}`;

  const html = await render(
    SubscriptionConfirmationEmail({
      firstName,
      confirmationUrl: confirmUrl,
    }),
    {
      pretty: false,
    }
  );

  return {
    html,
    subject: `Confirm your subscription to ${SITE_NAME}`,
  };
}
