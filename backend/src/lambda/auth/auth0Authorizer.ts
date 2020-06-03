import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-gw-du3-a.auth0.com/pem'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing', event.authorizationToken)
  try {
    const myJwtToken = await verifyToken(event.authorizationToken)
    logger.info('authorized', myJwtToken)

    return {
      principalId: myJwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (error) {
    logger.error('not authorized', { error: error.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const myToken = getToken(authHeader)
  const myJwt: Jwt = decode(myToken, { complete: true }) as Jwt

  if(!myJwt){
    throw new Error('invalid')
  }
  try{
    const response = await Axios.get(jwksUrl);
    console.log(response)
    var myVerifiedToken = verify(myToken, response.data,{algorithms:['RS256']})

    console.log('verified', myVerifiedToken)
    return myVerifiedToken as JwtPayload
  }catch(error){
    console.error(error)
    return undefined
  }
}

function getToken(myAuthHeader: string): string {
  if (!myAuthHeader) throw new Error('No authentication header')

  if (!myAuthHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid header')

  const mySplit = myAuthHeader.split(' ')
  const myToken = mySplit[1]

  return myToken
}
