import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type SubscriptionConfirmationEmailProps = {
  firstName: string;
  confirmationUrl: string;
};

export function SubscriptionConfirmationEmail({
  firstName = "there",
  confirmationUrl,
}: SubscriptionConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to Lyovson.com</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Confirm your subscription</Heading>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            Thank you for subscribing to Lyovson.com! Please confirm your
            subscription by clicking the button below:
          </Text>
          <Section style={buttonContainer}>
            <Button href={confirmationUrl} style={button}>
              Confirm Subscription
            </Button>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Text style={link}>{confirmationUrl}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            This link will expire in 24 hours. If you didn't request this
            subscription, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SubscriptionConfirmationEmail;

// Styles
const main = {
  backgroundColor: "#faf7fa",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const h1 = {
  color: "#2e1f3a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "32px",
  margin: "0 0 20px",
  padding: "0",
};

const text = {
  color: "#3d3240",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const buttonContainer = {
  padding: "24px 0",
};

const button = {
  backgroundColor: "#573468",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 32px",
};

const link = {
  color: "#6e4c7c",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e5dbe8",
  margin: "32px 0",
};

const footer = {
  color: "#75677a",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};
