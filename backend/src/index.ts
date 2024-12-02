import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "http-crud-tutorial-items";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let body: any;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const { httpMethod, path, pathParameters, body: requestBody } = event;

    if (httpMethod === "DELETE" && pathParameters?.id) {
      await dynamo.send(
        new DeleteCommand({
          TableName: tableName,
          Key: { id: pathParameters.id },
        })
      );
      body = `Deleted item ${pathParameters.id}`;
    } else if (httpMethod === "GET" && pathParameters?.id) {
      const result = await dynamo.send(
        new GetCommand({
          TableName: tableName,
          Key: { id: pathParameters.id },
        })
      );
      body = result.Item;
    } else if (httpMethod === "GET" && path === "/items") {
      const scanResult = await dynamo.send(
        new ScanCommand({ TableName: tableName })
      );
      body = scanResult.Items;
    } else if (httpMethod === "PUT" && requestBody) {
      const requestJSON = JSON.parse(requestBody);
      await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            id: requestJSON.id,
            price: requestJSON.price,
            name: requestJSON.name,
          },
        })
      );
      body = `Put item ${requestJSON.id}`;
    } else {
      throw new Error(`Unsupported route: ${httpMethod} ${path}`);
    }
  } catch (err: any) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
