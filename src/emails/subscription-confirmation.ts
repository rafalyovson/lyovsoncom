import { getServerSideURL } from '@/utilities/getURL'

type ConfirmationEmailProps = {
  firstName: string
  confirmationToken: string
  projectName: string
}

export function getSubscriptionConfirmationEmail({
  firstName,
  confirmationToken,
  projectName,
}: ConfirmationEmailProps): { html: string; subject: string } {
  const confirmUrl = `${getServerSideURL()}/api/confirm-subscription?token=${confirmationToken}`

  const html = `
    <div>
      <h2>Confirm your subscription to ${projectName}</h2>
      <p>Hi ${firstName},</p>
      <p>Please confirm your subscription by clicking the link below:</p>
      <p>
        <a href="${confirmUrl}">Confirm Subscription</a>
      </p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this subscription, you can safely ignore this email.</p>
    </div>
  `

  return {
    html,
    subject: `Confirm your subscription to ${projectName}`,
  }
}
