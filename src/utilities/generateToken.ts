import { randomBytes } from "node:crypto";

export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex");
}
