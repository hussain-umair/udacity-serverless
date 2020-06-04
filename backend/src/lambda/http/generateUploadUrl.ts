import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {S3Helper} from '../../services/s3Helper'
import {DataSuccessResponse} from '../../services/apiResponses/DataSuccessResponse'
import {TodosAccess} from '../../dataLayer/TodoDataLayer'
import {createLogger} from '../../utils/logger'

const myTodosAccess = new TodosAccess()
const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myTodoId = myEvent.pathParameters.todoId
  const myAuthHeader = myEvent.headers['Authrization']
  
  const myUrl =  new S3Helper().getPresignedUrl(myTodoId)
  return DataSuccessResponse(200,"uploadUrl",myUrl)
}
