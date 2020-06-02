import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {S3Helper} from '../../helpers/s3Helper'
import {ApiResponseHelper} from '../../helpers/apiResponseHelper'
import {TodosAccess} from '../../dataLayer/todosAccess'
import {getUserId} from '../../helpers/authHelper'
import {createLogger} from '../../utils/logger'

const todosAccess = new TodosAccess()
const apiResponseHelper = new ApiResponseHelper()
const logger = createLogger('todos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const authHeader = event.headers['Authrization']
  const userId = getUserId(authHeader)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const item = await todosAccess.getTodoById(todoId)
  if(item.Count == 0){
    logger.error(`user ${userId} requesting put url for non exists todo with id ${todoId}`)
    return apiResponseHelper.generateErrorResponse(400,'Todo not exist')
  }
  if(item.Items[0].userId !== userId){
    logger.error(`user ${userId} requesting put url todo does not belong to his account with id ${todoId}`)
    return apiResponseHelper.generateErrorResponse(400,'TODO does not belong to authorized user')
  }

  const url =  new S3Helper().getPresignedUrl(todoId)
  
  return apiResponseHelper.generateDataSuccessResponse(200,"uploadUrl",url)


}
