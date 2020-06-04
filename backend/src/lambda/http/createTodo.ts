import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {getUserId} from '../../services/authHelper'
import {TodosAccess} from '../../dataLayer/TodoDataLayer' 
import {DataSuccessResponse} from '../../services/apiResponses/DataSuccessResponse'
import {createLogger} from '../../utils/logger'

const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myNewTodo: CreateTodoRequest = JSON.parse(myEvent.body)
  const myAuthHeader = myEvent.headers['Authorization']
  const myUserId = getUserId(myAuthHeader)
  logger.info(`create group for ${myUserId} data ${myNewTodo}`)
  const myItem = await new TodosAccess().createTodo(myNewTodo,myUserId)
  
  return DataSuccessResponse(201,'item',myItem)
}
