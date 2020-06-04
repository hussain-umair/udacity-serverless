import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {getUserId} from '../../services/authHelper'
import {TodosAccess} from '../../dataLayer/TodoDataLayer'
import {EmptySuccessResponse} from '../../services/apiResponses/EmptySuccessResponse'
import {createLogger} from '../../utils/logger'

const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myTodoId = myEvent.pathParameters.todoId
  const myUpdatedTodo: UpdateTodoRequest = JSON.parse(myEvent.body)
  const myAuthHeader = myEvent.headers['Authorization']
  const myUserId = getUserId(myAuthHeader)

  logger.info(`${myUserId} updating ${myTodoId} to be ${myUpdatedTodo}`)
  await new TodosAccess().updateTodo(myUpdatedTodo,myTodoId)
  return EmptySuccessResponse(204)
}
