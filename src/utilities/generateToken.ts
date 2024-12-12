import { randomBytes } from 'crypto'

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex')
}
