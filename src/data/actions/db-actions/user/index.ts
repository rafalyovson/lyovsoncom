import { ResponseType } from '@/data/types';
import { User } from '@/data/schema';
import { UserFull } from '@/data/types/user-full';

// export type UserResponse = ResponseType;

export type UserAllResponse = ResponseType & {
  users: User[] | null;
};

export type UserOneResponse = ResponseType & {
  user: User | null;
};

export type UserFullAllResponse = ResponseType & {
  users: UserFull[] | null;
};

export type UserFullOneResponse = ResponseType & {
  user: UserFull | null;
};

export { userSelectByUsername } from './user-select-one';
export { userSelectAll } from '@/data/actions/db-actions/user/user-select-all';
