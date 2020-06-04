const uuid = require('uuid/v4')
import * as AWS from 'aws-sdk'
import * as XRayAWS from 'aws-xray-sdk'
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";



export class TodosAccess{
    constructor(
        private readonly myTodosTable = process.env.SERVERLESS_TODO_TABLE,
        private readonly myUserIdIndex = process.env.USER_ID_INDEX,
        private readonly XAWS = XRayAWS.captureAWS(AWS),
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient()
    )
        {}
    async deleteTodoById(myTodoId: string){
        const myParam = {
            TableName: this.myTodosTable,
            Key:{
                "todoId":myTodoId
            }
        }
        await this.docClient.delete(myParam).promise()
    }
    async updateTodo(myUpdatedTodo:UpdateTodoRequest,todoId:string){
        await this.docClient.update({
            TableName: this.myTodosTable,
            Key:{
                'todoId':todoId
            },
            UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
            ExpressionAttributeValues: {
                ':n' : myUpdatedTodo.name,
                ':d' : myUpdatedTodo.dueDate,
                ':done' : myUpdatedTodo.done
            },
            ExpressionAttributeNames:{
                "#namefield": "name"
            }
        }).promise()
    }
    async createTodo(request: CreateTodoRequest,userId: string): Promise<TodoItem>{
        const myNewId = uuid()
        const myItem = new TodoItem()
        myItem.userId= userId
        myItem.todoId= myNewId
        myItem.createdAt= new Date().toISOString()
        myItem.name= request.name
        myItem.dueDate= request.dueDate
        myItem.done= false
        
        await this.docClient.put({
            TableName: this.myTodosTable,
            Item: myItem
        }).promise()
        
        return myItem
    }
    async getTodoById(mySendId: string): Promise<AWS.DynamoDB.QueryOutput>{
        return await this.docClient.query({
            TableName: this.myTodosTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues:{
                ':todoId': mySendId
            }
        }).promise()
    }
    async getUserTodos(userId: string): Promise<TodoItem[]>{
        const myResult = await this.docClient.query({
            TableName: this.myTodosTable,
            IndexName: this.myUserIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId':userId
            }
        }).promise()
        return myResult.Items as TodoItem[]
    }
}