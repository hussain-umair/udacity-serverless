import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(JwtToken: string): string {
  const DecodedJwt = decode(JwtToken) as JwtPayload
  return DecodedJwt.sub
}
