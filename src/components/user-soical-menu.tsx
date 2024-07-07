import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faRedditAlien,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { UserFull } from '@/data/types/user-full';

export async function UserSocialMenu({
  user,
  className,
}: {
  user: UserFull;
  className?: string;
}) {
  return (
    <nav className={`flex gap-2  ${className}`}>
      {user.email && (
        <Button asChild variant={'secondary'} size="icon">
          <a
            href={`mailto:${user.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
          </a>
        </Button>
      )}
      {user.xLink && (
        <Button asChild variant={'secondary'} size="icon">
          <a href={user.xLink || ''} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
          </a>
        </Button>
      )}
      {user.redditLink && (
        <Button asChild variant={'secondary'} size="icon">
          <a
            href={user.redditLink || ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faRedditAlien} className="w-4 h-4" />
          </a>
        </Button>
      )}
      {user.linkedInLink && (
        <Button asChild variant={'secondary'} size="icon">
          <a
            href={user.linkedInLink || ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
          </a>
        </Button>
      )}
      {user.githubLink && (
        <Button asChild variant={'secondary'} size="icon">
          <a
            href={user.githubLink || ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
          </a>
        </Button>
      )}
      {user.youtubeLink && (
        <Button asChild variant={'secondary'} size="icon">
          <a
            href={user.youtubeLink || ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faYoutube} className="w-4 h-4" />
          </a>
        </Button>
      )}
    </nav>
  );
}
