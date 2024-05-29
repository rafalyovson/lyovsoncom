import PostGrid from "@/app/(castle)/ui/PostGrid";
import Link from "next/link";

export default function Page() {
  return (
    <Link href="/rafa/portfolio">
      <h1>Rafa</h1>
      <PostGrid />;
    </Link>
  );
}
