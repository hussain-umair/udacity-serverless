import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../../helpers/authHelper'
import {TodosAccess} from '../../dataLayer/todosAccess'
import {S3Helper} from '../../helpers/s3Helper'
import {ApiResponseHelper} from '../../helpers/apiResponseHelper'
import {createLogger} from '../../utils/logger'

const myS3Helper = new S3Helper()
const myApiResponseHelper =  new ApiResponseHelper()
const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (myEvent: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const myAuthHeader = myEvent.headers['Authorization']
  const myUserId = getUserId(myAuthHeader)
  logger.info(`get groups ${myUserId}`)
  const myResult = await new TodosAccess().getUserTodos(myUserId)

  for(const myRecord of myResult){
    myRecord.attachmentUrl = await myS3Helper.getTodoAttachmentUrl(myRecord.todoId)
  }

  return myApiResponseHelper.generateDataSuccessResponse(200,'items',myResult)
}
