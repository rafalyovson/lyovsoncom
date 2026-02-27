import type { NextRequest } from "next/server";
import type { Payload } from "payload";

interface EmbeddingMutationAuthResult {
  authorized: boolean;
  reason?: string;
}

export async function authorizeEmbeddingMutation(
  request: NextRequest,
  payload: Payload
): Promise<EmbeddingMutationAuthResult> {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (bearerToken && bearerToken === process.env.CRON_SECRET) {
    return { authorized: true };
  }

  try {
    const { user } = await payload.auth({ headers: request.headers });
    if (user) {
      return { authorized: true };
    }
  } catch {
    // Fall through to explicit unauthorized response.
  }

  return {
    authorized: false,
    reason:
      "Unauthorized. Regeneration requires admin authentication or valid CRON_SECRET.",
  };
}
