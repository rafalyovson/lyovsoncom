import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/data/schema";
import { usersGetAll } from "@/lib/actions/users-get-all";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "../ui/page-header";

const Users = async () => {
  const allUsers = await usersGetAll();
  if (!allUsers) {
    return <div>No users</div>;
  }
  return (
    <>
      <PageHeader title="Users" link="/dungeon/users/create" />
      <section className="flex flex-col gap-4 p-4">
        {allUsers.map((user: User) => (
          <Link key={user.id} href={`/dungeon/users/${user.username}`}>
            <Card key={user.id}>
              <CardHeader>
                {
                  <Image
                    src={user.image || ""}
                    alt={user.name + " avatar"}
                    width={100}
                    height={100}
                  />
                }
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{user.email}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
};

export default Users;
