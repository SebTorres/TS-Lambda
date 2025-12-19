import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { UpdateCoffeeOrderDto } from '../dto/UpdateCoffeeOrderDto';
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
    const validationResult = await validateDto(UpdateCoffeeOrderDto, requestBody);
    
    if (!validationResult.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify(formatValidationErrorResponse(validationResult.errors)),
      };
    }

    // Extract validated data
    const { order_id, new_status, customer_name }: { order_id: string; new_status: string; customer_name: string } = requestBody;

    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.COFFEE_ORDERS_TABLE || '',
      Key: {
        OrderId: order_id,
        CustomerName: customer_name,
      },
      UpdateExpression: 'SET OrderStatus = :status',
      ExpressionAttributeValues: {
        ':status': new_status,
      },
    };

    await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order status updated successfully!', OrderId: order_id }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not update order: ${error.message}` }),
    };
  }
};
