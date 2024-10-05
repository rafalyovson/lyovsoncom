import { PageHeader } from '../ui/page-header';
import { UserTable } from '../ui/user-table';
import { userSelectFullAll } from '@/lib/actions/db-actions/user/user-select-full-all';

const Users = async () => {
  const result = await userSelectFullAll();
  if (!result.success || !result.users) {
    return <div>{result.message}</div>;
  }

  const users = result.users;
  return (
    <>
      <PageHeader title="Users" link="/dungeon/users/create" />
      <UserTable users={users} />
    </>
  );
};

export default Users;
