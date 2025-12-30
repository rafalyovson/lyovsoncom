import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Lyovson } from "@/payload-types";
import { getClientSideURL } from "./getURL";

export const getMeUser = async (
  args: { nullUserRedirect?: string; validUserRedirect?: string } = {}
): Promise<{
  token: string;
  user: Lyovson;
}> => {
  const { nullUserRedirect, validUserRedirect } = args;
  const cookieStore = await cookies();
  const token = cookieStore.get("payload-token")?.value;

  const meUserReq = await fetch(`${getClientSideURL()}/api/lyovsons/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });

  const {
    user,
  }: {
    user: Lyovson;
  } = await meUserReq.json();

  if (validUserRedirect && meUserReq.ok && user) {
    redirect(validUserRedirect);
  }

  if (nullUserRedirect && !(meUserReq.ok && user)) {
    redirect(nullUserRedirect);
  }

  // Validate token exists (should be guaranteed by redirects above, but be explicit)
  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    token,
    user,
  };
};
