import Link from "next/link";
import "./login-text.scss";

export default function LoginText() {
  return (
    <Link
      className="login-return-link"
      href="https://www.lyovson.com"
      target="_blank"
    >
      Return to Lyovson.com
    </Link>
  );
}
