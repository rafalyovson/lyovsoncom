import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type WelcomeEmailProps = {
  firstName: string;
  siteUrl: string;
};

export function WelcomeEmail({
  firstName = "there",
  siteUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Lyovson.com!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Lyovson.com! 👋</Heading>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            Thank you for subscribing! We're excited to have you join our
            community. You'll now receive updates about our latest posts,
            projects, and research.
          </Text>
          <Section style={buttonContainer}>
            <Button href={siteUrl} style={button}>
              Visit Lyovson.com
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={h2}>What to expect</Text>
          <Text style={text}>
            We share insights on programming, design, philosophy, and research.
            You'll get updates on:
          </Text>
          <ul style={list}>
            <li style={listItem}>New blog posts and articles</li>
            <li style={listItem}>Project updates and releases</li>
            <li style={listItem}>Research findings and experiments</li>
          </ul>
          <Hr style={hr} />
          <Text style={h2}>Connect with us</Text>
          <Section>
            <Link href="https://x.com/rafalyovson" style={socialLink}>
              Twitter
            </Link>
            {" • "}
            <Link href="https://github.com/rafalyovson" style={socialLink}>
              GitHub
            </Link>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this because you subscribed to Lyovson.com. If you
            no longer want to receive these emails, you can unsubscribe at any
            time.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

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

const h2 = {
  color: "#2e1f3a",
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "28px",
  margin: "0 0 12px",
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

const list = {
  color: "#3d3240",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
  paddingLeft: "20px",
};

const listItem = {
  marginBottom: "8px",
};

const socialLink = {
  color: "#6e4c7c",
  fontSize: "14px",
  textDecoration: "underline",
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
