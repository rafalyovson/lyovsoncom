import About from "@/app/(castle)/ui/About";
import PostGrid from "@/app/(castle)/ui/PostGrid";

export default function Portfolio() {
  return (
    <main className="grid min-h-screen grid-cols-1 grid-rows-1 max-w-screen place-items-center">
      <About />
      <PostGrid />
    </main>
  );
}
