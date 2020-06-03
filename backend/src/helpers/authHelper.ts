import { Jwt } from '../auth/Jwt'
import { decode } from 'jsonwebtoken'

export function getUserId(myAuthHeader: string): string{
    console.log('authHeader: ',myAuthHeader)
    const myToken = tryToken(myAuthHeader)
    const myJwt: Jwt = decode(myToken,{complete:true}) as Jwt
    console.log('jwt: ',myJwt.payload)
    return myJwt.payload.sub
}

function tryToken(myAuthHeader:string):string{
    if(!myAuthHeader) throw new Error('No Authentication Header')

    if(!myAuthHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid Authentication Header')

    const mySplit = myAuthHeader.split(' ')
    const myToken = mySplit[1]

    return myToken
}