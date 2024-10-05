import { UserFull } from '@/data/types/user-full';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/ui/table';
import { Button } from '@/components/shadcn/ui/button';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import Image from 'next/image';

export async function UserTable({ users }: { users: UserFull[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>

          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="w-[120px]">
              <Image
                className="w-[100px] aspect-square object-cover"
                src={user.avatar?.url || ''}
                alt={user.avatar?.altText || ''}
                width={200}
                height={200}
              />
            </TableCell>

            <TableCell>
              <Link href={`/dungeon/users/${user.username}`}>{user.name}</Link>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <section className="flex gap-2 ">
                <Button asChild variant={'secondary'} size="icon">
                  <Link href={`/dungeon/users/${user.username}/update`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </section>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
