import {
  faCodepen,
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const Header = () => (
  <header className="text-center text-4xl py-4 text-white bg-black">
    <h1>Lyovson</h1>
  </header>
);

const About = () => (
  <section className="px-4 py-8 text-black bg-white">
    <h2 className="text-2xl mb-4">About Me</h2>
    <p>
      I am a software developer with a passion for learning and building
      impactful projects. I specialize in full-stack development, particularly
      with JavaScript and Python.
    </p>
  </section>
);

// ...

// ...

const Projects = () => (
  <section className="px-4 py-8 text-gray-800 bg-gray-100 border-b border-gray-300">
    <h2 className="text-2xl mb-4">Projects</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="border rounded shadow border-gray-300 bg-white">
          <div className="relative h-64">
            <Image
              src={`https://via.placeholder.com/150?text=Project+${i + 1}`}
              alt={`Project ${i + 1}`}
              width={500}
              height={300}
              className="absolute w-full h-full object-cover rounded-t"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl mb-2">Project {i + 1}</h3>
            <p>
              This is a brief description of Project {i + 1}. It was built using
              React and Node.js.
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Contact = () => (
  <section className="px-4 py-8 text-gray-800 bg-gray-100 border-b border-gray-300">
    <h2 className="text-2xl mb-4">Contact</h2>
    <div className="flex space-x-4">
      <a
        href="https://www.x.com/lyovson"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faXTwitter} size="2x" />
        </div>
      </a>
      <a
        href="https://www.linkedin.com/in/your-name"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </div>
      </a>
      <a
        href="https://github.com/your-name"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </div>
      </a>
      <a
        href="https://codepen.io/your-name"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faCodepen} size="2x" />
        </div>
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-6 px-8 bg-black text-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Your social media links go here */}
      </div>
      <p className="text-sm">© 2023 Lyovson</p>
    </div>
  </footer>
);

export default function Portfolio() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <main className="flex-grow">
        <Header />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
