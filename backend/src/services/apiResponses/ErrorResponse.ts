import {APIGatewayProxyResult} from 'aws-lambda'

export function ErrorResponse(myStatusCode: number,message:string): APIGatewayProxyResult{
    return {
        statusCode:myStatusCode,
        headers:{
            'Access-Control-Allow-Origin':'*'
        },
        body:JSON.stringify({
            message
        })
    }
}