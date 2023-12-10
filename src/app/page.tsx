import About from "./components/About";
import Contact from "./components/Contact";

import Projects from "./components/Projects";

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
