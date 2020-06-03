import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {getUserId} from '../../helpers/authHelper'
import {TodosAccess} from '../../dataLayer/todosAccess' 
import {ApiResponseHelper} from '../../helpers/apiResponseHelper'
import {createLogger} from '../../utils/logger'

const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myNewTodo: CreateTodoRequest = JSON.parse(myEvent.body)
  const myAuthHeader = myEvent.headers['Authorization']
  const myUserId = getUserId(myAuthHeader)
  logger.info(`create group for user ${myUserId} with data ${myNewTodo}`)
  const myItem = await new TodosAccess().createTodo(myNewTodo,myUserId)
  
  return new ApiResponseHelper().generateDataSuccessResponse(201,'item',myItem)
}
