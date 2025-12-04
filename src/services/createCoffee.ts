import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { CoffeeOrderDTO } from '../types/coffeeOrder';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * AWS Lambda handler for creating a new coffee order.
 *
 * @param event - The API Gateway event containing the request body with customer and coffee blend information.
 * @returns A promise that resolves to an APIGatewayProxyResult:
 * - On success: statusCode 200 and a JSON body with a success message and the generated OrderId.
 * - On failure: statusCode 500 and a JSON body with an error message.
 *
 * @remarks
 * Expects the request body to contain `customer_name` and `coffee_blend` fields.
 * Stores the new order in DynamoDB using the table specified by the `COFFEE_ORDERS_TABLE` environment variable.
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestBody = JSON.parse(event.body || '{}');
  const { customer_name, coffee_blend }: { customer_name: string; coffee_blend: string } = requestBody;
  const orderId: string = uuidv4();

  const order: CoffeeOrderDTO = {
    OrderId: orderId,
    CustomerName: customer_name,
    CoffeeBlend: coffee_blend,
    OrderStatus: 'Pending',
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.COFFEE_ORDERS_TABLE || '',
    Item: order
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order created successfully!', OrderId: orderId }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not create order: ${error.message}` }),
    };
  }
};