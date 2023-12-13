import {
  faCodepen,
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RafaSocials = () => (
  <section className="p-4 ">
    <div className="flex gap-4">
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
    </div>
  </section>
);

export default RafaSocials;
