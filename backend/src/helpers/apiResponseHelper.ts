import {APIGatewayProxyResult} from 'aws-lambda'

export class ApiResponseHelper{
    generateDataSuccessResponse(myStatusCode: number, key: string, myItems: any): APIGatewayProxyResult{
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
    generateEmptySuccessResponse(myStatusCode: number):APIGatewayProxyResult{
        return {
            statusCode:myStatusCode,
            headers:{
                'Access-Control-Allow-Origin':'*'
            },
            body: null
        }
    }
    generateErrorResponse(myStatusCode: number,message:string): APIGatewayProxyResult{
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
}