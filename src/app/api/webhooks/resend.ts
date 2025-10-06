import configPromise from "@payload-config";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPayload } from "payload";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payload = await getPayload({ config: configPromise });

    if (req.method === "POST") {
      const { event, data } = req.body;

      if (!(event && data && data.email)) {
        return res.status(400).json({ error: "Invalid payload" });
      }

      switch (event) {
        case "unsubscribe":
        case "complaint":
          await payload.update({
            collection: "contacts",
            where: { email: { equals: data.email } },
            data: { status: "unsubscribed" },
          });
          break;
        default:
          return res.status(400).json({ error: "Unhandled event type" });
      }

      res.status(200).json({ message: "Webhook processed successfully" });
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (_error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
