import Button from "@/app/ui/Button";
import {
  faCodepen,
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RafaSocials = () => (
  <section className="p-4 ">
    <nav className="flex gap-4">
      <Button>
        <a
          href="https://www.x.com/lyovson"
          target="_blank"
          rel="noopener noreferrer"
          title="X"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </Button>
      <Button>
        <a
          href="https://www.linkedin.com/in/your-name"
          target="_blank"
          rel="noopener noreferrer"
          title="Linkedin"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </Button>
      <Button>
        <a
          href="https://github.com/your-name"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </Button>
      <Button>
        <a
          href="https://codepen.io/your-name"
          target="_blank"
          rel="noopener noreferrer"
          title="CodePen"
        >
          <FontAwesomeIcon icon={faCodepen} />
        </a>
      </Button>
    </nav>
  </section>
);

export default RafaSocials;
