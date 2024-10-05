import { Button } from '@/components/shadcn/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const PageHeader = ({
  title,
  link,
}: {
  title: string;
  link: string;
}) => {
  return (
    <header className="flex justify-between p-4">
      <h1 className="text-4xl font-bold text-center">{title}</h1>
      <Button asChild variant={'secondary'} size={'icon'}>
        <Link href={{ pathname: link }}>
          <Plus className="h-4 w-4" />
        </Link>
      </Button>
    </header>
  );
};
