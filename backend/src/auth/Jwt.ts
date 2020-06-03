import { JwtPayload } from './JwtPayload'
import { JwtHeader } from 'jsonwebtoken'

export interface Jwt {
  payload: JwtPayload
  header: JwtHeader
}
