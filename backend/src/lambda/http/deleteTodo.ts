import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../../helpers/authHelper'
import { TodosAccess } from '../../dataLayer/todosAccess'
import {ApiResponseHelper} from '../../helpers/apiResponseHelper'
import {createLogger} from '../../utils/logger'

const myTodosAccess = new TodosAccess()
const myApiResponseHelper = new ApiResponseHelper()
const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myTodoId = myEvent.pathParameters.todoId
  if(!myTodoId){
    logger.error('invalid attempt')
    return myApiResponseHelper.generateErrorResponse(400,'invalid')
  }

  const myAuthHeader = myEvent.headers['Authorization']
  const myUserId = getUserId(myAuthHeader)

  const myItem = await myTodosAccess.getTodoById(myTodoId)
  if(myItem.Count == 0){
    logger.error(`user ${myUserId} delete non exists todo ${myTodoId}`)
    return myApiResponseHelper.generateErrorResponse(400,'not exists')
  }

  if(myItem.Items[0].userId !== myUserId){
    logger.error(`user ${myUserId} requesting not ${myTodoId}`)
    return myApiResponseHelper.generateErrorResponse(400,'not authorized user')
  }

  logger.info(`User ${myUserId} deleting ${myTodoId}`)
  await myTodosAccess.deleteTodoById(myTodoId)

  return myApiResponseHelper.generateEmptySuccessResponse(204)
}
