import Button from "@/app/ui/Button";
import {
  faInstagram,
  faLinkedin,
  faRedditAlien,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const JessSocials = () => (
  <section className="p-4 ">
    <nav className="flex gap-4">
      <Button>
        <a
          href="https://www.instagram.com/khachunts/"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </Button>
      <Button>
        <a
          href="https://www.linkedin.com/in/khachunts"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </Button>
      <Button>
        <a
          href="https://twitter.com/HasmikKhachunts"
          target="_blank"
          rel="noopener noreferrer"
          title="X"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </Button>

      <Button>
        <a
          href="https://www.reddit.com/user/hasmikkhachunts"
          target="_blank"
          rel="noopener noreferrer"
          title="Reddit"
        >
          <FontAwesomeIcon icon={faRedditAlien} />
        </a>
      </Button>
    </nav>
  </section>
);

export default JessSocials;
