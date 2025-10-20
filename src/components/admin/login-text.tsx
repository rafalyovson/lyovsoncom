import Link from "next/link";

export default function LoginText() {
  return (
    <Link href="https://www.lyovson.com" target="_blank">
      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          textDecoration: "underline",
        }}
      >
        Return to Lyovson.com
      </p>
    </Link>
  );
}
