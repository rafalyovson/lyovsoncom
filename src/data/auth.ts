import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Twitter from 'next-auth/providers/twitter';
import { db } from './db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  basePath: '/bridge/auth',
  adapter: DrizzleAdapter(db),
  providers: [GitHub, Twitter],
});
