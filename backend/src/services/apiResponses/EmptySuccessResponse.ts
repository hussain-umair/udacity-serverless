import {APIGatewayProxyResult} from 'aws-lambda'

export function EmptySuccessResponse(myStatusCode: number):APIGatewayProxyResult{
    return {
        statusCode:myStatusCode,
        headers:{
            'Access-Control-Allow-Origin':'*'
        },
        body: null
    }
}