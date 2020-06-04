import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../../services/authHelper'
import { TodosAccess } from '../../dataLayer/TodoDataLayer'
import {EmptySuccessResponse} from '../../services/apiResponses/EmptySuccessResponse'
import {createLogger} from '../../utils/logger'

const myTodosAccess = new TodosAccess()
const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myTodoId = myEvent.pathParameters.todoId
  

  const myAuthHeader = myEvent.headers['Authorization']
  const myUserId = getUserId(myAuthHeader)

  logger.info(`User ${myUserId} deleting ${myTodoId}`)
  await myTodosAccess.deleteTodoById(myTodoId)

  return EmptySuccessResponse(204)
}
