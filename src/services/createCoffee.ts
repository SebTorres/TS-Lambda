import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { CreateCoffeeOrderDto } from '../dto/CreateCoffeeOrderDto';
import { validateDto, formatValidationErrorResponse } from '../utils/validator';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    let requestBody: any;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Validation failed',
          details: [{ field: 'body', message: 'Invalid JSON format in request body' }],
        }),
      };
    }

    // Validate request body
    const validationResult = await validateDto(CreateCoffeeOrderDto, requestBody);
    
    if (!validationResult.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify(formatValidationErrorResponse(validationResult.errors)),
      };
    }

    // Extract validated data
    const { customer_name, coffee_blend }: { customer_name: string; coffee_blend: string } = requestBody;
    const orderId: string = uuidv4();

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.COFFEE_ORDERS_TABLE || '',
      Item: {
        OrderId: orderId,
        CustomerName: customer_name,
        CoffeeBlend: coffee_blend,
        OrderStatus: 'Pending',
      },
    };

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