import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {getUserId} from '../../helpers/authHelper'
import {TodosAccess} from '../../dataLayer/todosAccess'
import {ApiResponseHelper} from '../../helpers/apiResponseHelper'
import {createLogger} from '../../utils/logger'

const logger = createLogger('todos')
const myTodosAccess = new TodosAccess()
const myApiResponseHelper = new ApiResponseHelper()

export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myTodoId = myEvent.pathParameters.todoId
  const myUpdatedTodo: UpdateTodoRequest = JSON.parse(myEvent.body)
  const myAuthHeader = myEvent.headers['Authorization']
  const myUserId = getUserId(myAuthHeader)

  const myItem = await myTodosAccess.getTodoById(myTodoId)
  
  if(myItem.Count==0){
    logger.error(`user ${myUserId} requesting ${myTodoId}`)
    return myApiResponseHelper.generateErrorResponse(400,'not exist')
  }
  if(myItem.Items[0].userId !== myUserId){
    logger.error(`user ${myUserId} requesting ${myTodoId}`)
    return myApiResponseHelper.generateErrorResponse(400,'not authorized user')
  }
  logger.info(`${myUserId} updating ${myTodoId} to be ${myUpdatedTodo}`)
  await new TodosAccess().updateTodo(myUpdatedTodo,myTodoId)
  return myApiResponseHelper.generateEmptySuccessResponse(204)
}
