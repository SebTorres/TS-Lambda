import 'reflect-metadata';
import { handler } from '../../src/services/createCoffee';
import { APIGatewayProxyEvent } from 'aws-lambda';
import AWS from 'aws-sdk';

// Mock AWS DynamoDB
jest.mock('aws-sdk', () => {
  const mockPut = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  });

  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: mockPut,
      })),
    },
  };
});

describe('CreateCoffee Lambda Handler', () => {
  let mockPut: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    mockPut = dynamoDb.put as jest.Mock;
    process.env.COFFEE_ORDERS_TABLE = 'test-table';
  });

  const createMockEvent = (body: any): APIGatewayProxyEvent => {
    return {
      body: JSON.stringify(body),
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'POST',
      isBase64Encoded: false,
      path: '/coffee',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {} as any,
      resource: '',
    };
  };

  describe('Successful validations', () => {
    it('should create order with valid input', async () => {
      const event = createMockEvent({
        customer_name: 'John Doe',
        coffee_blend: 'latte',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(mockPut).toHaveBeenCalledTimes(1);
      const body = JSON.parse(result.body);
      expect(body.message).toBe('Order created successfully!');
      expect(body.OrderId).toBeDefined();
    });

    it('should accept customer name with spaces', async () => {
      const event = createMockEvent({
        customer_name: 'Mary Jane Smith',
        coffee_blend: 'cappuccino',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(mockPut).toHaveBeenCalledTimes(1);
    });

    it('should accept customer name with hyphens', async () => {
      const event = createMockEvent({
        customer_name: 'Jean-Pierre',
        coffee_blend: 'espresso',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(mockPut).toHaveBeenCalledTimes(1);
    });

    it('should accept all valid coffee blends', async () => {
      const validBlends = ['espresso', 'americano', 'latte', 'cappuccino', 'macchiato', 'mocha', 'cold_brew', 'frappuccino'];

      for (const blend of validBlends) {
        jest.clearAllMocks();
        const event = createMockEvent({
          customer_name: 'Test User',
          coffee_blend: blend,
        });

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(mockPut).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Validation failures', () => {
    it('should return 400 when customer_name is missing', async () => {
      const event = createMockEvent({
        coffee_blend: 'latte',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.error).toBe('Validation failed');
      expect(body.details).toBeDefined();
      expect(body.details.some((e: any) => e.field === 'customer_name')).toBe(true);
    });

    it('should return 400 when customer_name is too short', async () => {
      const event = createMockEvent({
        customer_name: 'J',
        coffee_blend: 'latte',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.details.some((e: any) => e.field === 'customer_name')).toBe(true);
    });

    it('should return 400 when customer_name is too long', async () => {
      const event = createMockEvent({
        customer_name: 'A'.repeat(101),
        coffee_blend: 'latte',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.details.some((e: any) => e.field === 'customer_name')).toBe(true);
    });

    it('should return 400 when customer_name contains special characters', async () => {
      const event = createMockEvent({
        customer_name: 'John@Doe',
        coffee_blend: 'latte',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.details.some((e: any) => e.field === 'customer_name')).toBe(true);
    });

    it('should return 400 when coffee_blend is missing', async () => {
      const event = createMockEvent({
        customer_name: 'John Doe',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.details.some((e: any) => e.field === 'coffee_blend')).toBe(true);
    });

    it('should return 400 when coffee_blend is invalid', async () => {
      const event = createMockEvent({
        customer_name: 'John Doe',
        coffee_blend: 'invalid_blend',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.details.some((e: any) => e.field === 'coffee_blend')).toBe(true);
    });

    it('should return 400 when body is invalid JSON', async () => {
      const event = createMockEvent(null);
      event.body = 'invalid json';

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.error).toBe('Validation failed');
      expect(body.details.some((e: any) => e.message.includes('Invalid JSON'))).toBe(true);
    });

    it('should return 400 with multiple validation errors', async () => {
      const event = createMockEvent({
        customer_name: 'J',
        coffee_blend: 'invalid',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(mockPut).not.toHaveBeenCalled();
      const body = JSON.parse(result.body);
      expect(body.details.length).toBeGreaterThan(1);
    });
  });

  describe('Error handling', () => {
    it('should return 500 when DynamoDB operation fails', async () => {
      mockPut.mockReturnValueOnce({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      });

      const event = createMockEvent({
        customer_name: 'John Doe',
        coffee_blend: 'latte',
      });

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      const body = JSON.parse(result.body);
      expect(body.error).toContain('Could not create order');
    });
  });
});
