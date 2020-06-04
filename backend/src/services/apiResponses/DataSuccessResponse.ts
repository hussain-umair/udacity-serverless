import {APIGatewayProxyResult} from 'aws-lambda'

export function DataSuccessResponse(myStatusCode: number, key: string, myItems: any): APIGatewayProxyResult{
    return {
        statusCode: myStatusCode,
        headers:{
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
            [key]:myItems
        })
    }
}