import {
  faCodepen,
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemeSwitch from "./ThemeSwitcher";

const Contact = () => (
  <section className="px-4 py-8 text-gray-800 border-b border-gray-300 rounded-lg shadow-lg bg-gray-50 dark:bg-dark">
    <h2 className="mb-4 text-2xl text-center text-gray-700 dark:text-light">
      Contact
    </h2>
    <div className="flex justify-center space-x-4">
      <a
        href="https://www.x.com/lyovson"
        target="_blank"
        rel="noopener noreferrer"
        title="X"
        className="hover:text-indigo-500 dark:hover:text-indigo-300"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faXTwitter} size="2x" />
        </div>
      </a>
      <a
        href="https://www.linkedin.com/in/your-name"
        target="_blank"
        rel="noopener noreferrer"
        title="Linkedin"
        className="hover:text-indigo-500 dark:hover:text-indigo-300"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </div>
      </a>
      <a
        href="https://github.com/your-name"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        className="hover:text-indigo-500 dark:hover:text-indigo-300"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </div>
      </a>
      <a
        href="https://codepen.io/your-name"
        target="_blank"
        rel="noopener noreferrer"
        title="CodePen"
        className="hover:text-indigo-500 dark:hover:text-indigo-300"
      >
        <div className="w-10 h-10">
          <FontAwesomeIcon icon={faCodepen} size="2x" />
        </div>
      </a>
      <ThemeSwitch />
    </div>
  </section>
);

export default Contact;
