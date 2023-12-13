import About from "./ui/About";
import Contact from "./ui/Contact";

import Projects from "./ui/Projects";

export default function Portfolio() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <main className="flex-grow">
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
