import { z } from "zod";

export const newSocialSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  url: z.string().trim().url({ message: "Enter a valid URL." }),
});
