import { ResponseType } from '@/data/types';
import { User } from '@/data/schema';

// export type UserResponse = ResponseType;

export type UserAllResponse = ResponseType & {
  users: User[] | null;
};

export type UserOneResponse = ResponseType & {
  user: User | null;
};

export { userSelectByUsername } from './user-select-one';
export { userSelectAll } from '@/lib/actions/db-actions/user/user-select-all';
