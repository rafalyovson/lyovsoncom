import ThemeSwitch from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  faCodepen,
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Contact = () => (
  <section className="px-4 py-8 text-gray-800 border-b border-gray-300 rounded-lg shadow-lg bg-gray-50 dark:bg-dark">
    <h2 className="mb-4 text-2xl text-center text-gray-700 dark:text-light">
      Contact
    </h2>
    <div className="flex justify-center space-x-4">
      <Button>
        <a
          href="https://www.x.com/lyovson"
          target="_blank"
          rel="noopener noreferrer"
          title="X"
        >
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faXTwitter} size="2x" />
          </div>
        </a>
      </Button>
      <Button>
        <a
          href="https://www.linkedin.com/in/your-name"
          target="_blank"
          rel="noopener noreferrer"
          title="Linkedin"
        >
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </div>
        </a>
      </Button>
      <Button>
        <a
          href="https://github.com/your-name"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </div>
        </a>
      </Button>
      <Button>
        <a
          href="https://codepen.io/your-name"
          target="_blank"
          rel="noopener noreferrer"
          title="CodePen"
        >
          <div className="w-10 h-10">
            <FontAwesomeIcon icon={faCodepen} size="2x" />
          </div>
        </a>
      </Button>
      <ThemeSwitch />
    </div>
  </section>
);
