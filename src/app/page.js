import About from "./ui/About";
import Contact from "./ui/Contact";
import Posts from "./ui/PostGrid";

export default function Portfolio() {
  return (
    <div className="flex flex-col min-h-screen text-black bg-white">
      <main className="flex-grow">
        <About />
        <Posts />
        <Contact />
      </main>
    </div>
  );
}
