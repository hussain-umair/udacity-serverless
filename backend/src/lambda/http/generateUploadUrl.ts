import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {S3Helper} from '../../helpers/s3Helper'
import {ApiResponseHelper} from '../../helpers/apiResponseHelper'
import {TodosAccess} from '../../dataLayer/todosAccess'
import {getUserId} from '../../helpers/authHelper'
import {createLogger} from '../../utils/logger'

const myTodosAccess = new TodosAccess()
const myApiResponseHelper = new ApiResponseHelper()
const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myTodoId = myEvent.pathParameters.todoId
  const myAuthHeader = myEvent.headers['Authrization']
  const myUserId = getUserId(myAuthHeader)
  const myItem = await myTodosAccess.getTodoById(myTodoId)
  if(myItem.Count == 0){
    logger.error(`user ${myUserId} requesting put url for non exists todo with id ${myTodoId}`)
    return myApiResponseHelper.generateErrorResponse(400,'Todo not exist')
  }
  if(myItem.Items[0].userId !== myUserId){
    logger.error(`user ${myUserId} requesting put url todo does not belong to his account with id ${myTodoId}`)
    return myApiResponseHelper.generateErrorResponse(400,'TODO does not belong to authorized user')
  }
  const myUrl =  new S3Helper().getPresignedUrl(myTodoId)
  return myApiResponseHelper.generateDataSuccessResponse(200,"uploadUrl",myUrl)
}
