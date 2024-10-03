// CustomLink.tsx
import Link from 'next/link';
import { isInternalLink } from '@/lib/utils';
import { FC, ReactNode } from 'react';
import clsx from 'clsx';

type CustomLinkProps = {
  url: string;
  children: ReactNode;
  className?: string;
};

export const CustomLink: FC<CustomLinkProps> = ({
  url,
  children,
  className = '',
}) =>
  isInternalLink(url) ? (
    <Link
      href={{ pathname: url }}
      className={clsx(
        'text-blue-400 underline hover:text-blue-300 transition-colors',
        className,
      )}
    >
      {children}
    </Link>
  ) : (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'text-blue-400 underline hover:text-blue-300 transition-colors',
        className,
      )}
    >
      {children}
    </a>
  );
