import type { AccessArgs } from "payload";

import type { Lyovson } from "@/payload-types";

type isAuthenticated = (args: AccessArgs<Lyovson>) => boolean;

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user);
};
