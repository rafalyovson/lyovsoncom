import { redirect } from 'next/navigation';
import { userSelectFullOneByUsername } from '@/lib/actions/db-actions/user/user-select-full-one';
import { ImageCard } from '@/app/dungeon/ui/image-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import {
  faGithub,
  faLinkedin,
  faRedditAlien,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const Page = async ({ params }: { params: any }) => {
  const result = await userSelectFullOneByUsername({
    username: params.username,
  });

  if (!result.success || !result.user) {
    redirect('/dungeon/users');
  }
  return (
    <article className="flex flex-col md:flex-row gap-4 p-4">
      <section className={` `}>
        <ImageCard image={result.user.avatar!} />
      </section>
      <section className={`flex flex-col gap-2 `}>
        <h1 className="text-2xl font-bold ">{result.user.name}</h1>
        <p>{result.user.bio}</p>
        <nav className="flex gap-2">
          {result.user.email && (
            <Button asChild variant={'secondary'} size="icon">
              <a
                href={`mailto:${result.user.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
              </a>
            </Button>
          )}
          {result.user.xLink && (
            <Button asChild variant={'secondary'} size="icon">
              <a
                href={result.user.xLink || ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
              </a>
            </Button>
          )}
          {result.user.redditLink && (
            <Button asChild variant={'secondary'} size="icon">
              <a
                href={result.user.redditLink || ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faRedditAlien} className="w-4 h-4" />
              </a>
            </Button>
          )}
          {result.user.linkedInLink && (
            <Button asChild variant={'secondary'} size="icon">
              <a
                href={result.user.linkedInLink || ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
              </a>
            </Button>
          )}
          {result.user.githubLink && (
            <Button asChild variant={'secondary'} size="icon">
              <a
                href={result.user.githubLink || ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
              </a>
            </Button>
          )}
          {result.user.youtubeLink && (
            <Button asChild variant={'secondary'} size="icon">
              <a
                href={result.user.youtubeLink || ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faYoutube} className="w-4 h-4" />
              </a>
            </Button>
          )}
        </nav>
      </section>
    </article>
  );
};

export default Page;
