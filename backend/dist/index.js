"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const dynamo = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const tableName = "http-crud-tutorial-items";
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };
    try {
        const { httpMethod, path, pathParameters, body: requestBody } = event;
        if (httpMethod === "DELETE" && (pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.id)) {
            yield dynamo.send(new lib_dynamodb_1.DeleteCommand({
                TableName: tableName,
                Key: { id: pathParameters.id },
            }));
            body = `Deleted item ${pathParameters.id}`;
        }
        else if (httpMethod === "GET" && (pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.id)) {
            const result = yield dynamo.send(new lib_dynamodb_1.GetCommand({
                TableName: tableName,
                Key: { id: pathParameters.id },
            }));
            body = result.Item;
        }
        else if (httpMethod === "GET" && path === "/items") {
            const scanResult = yield dynamo.send(new lib_dynamodb_1.ScanCommand({ TableName: tableName }));
            body = scanResult.Items;
        }
        else if (httpMethod === "PUT" && requestBody) {
            const requestJSON = JSON.parse(requestBody);
            yield dynamo.send(new lib_dynamodb_1.PutCommand({
                TableName: tableName,
                Item: {
                    id: requestJSON.id,
                    price: requestJSON.price,
                    name: requestJSON.name,
                },
            }));
            body = `Put item ${requestJSON.id}`;
        }
        else {
            throw new Error(`Unsupported route: ${httpMethod} ${path}`);
        }
    }
    catch (err) {
        statusCode = 400;
        body = err.message;
    }
    finally {
        body = JSON.stringify(body);
    }
    return {
        statusCode,
        body,
        headers,
    };
});
exports.handler = handler;
