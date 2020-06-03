// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ehpa3aabg4'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-gw-du3-a.auth0.com',            // Auth0 domain
  clientId: '5mMLGsbNssNMUEy587F0JUEA23kErJTm',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
