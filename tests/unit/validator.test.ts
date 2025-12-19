import 'reflect-metadata';
import { validateDto, formatValidationErrorResponse } from '../../src/utils/validator';
import { CreateCoffeeOrderDto } from '../../src/dto/CreateCoffeeOrderDto';
import { UpdateCoffeeOrderDto } from '../../src/dto/UpdateCoffeeOrderDto';

describe('Validator Utility', () => {
  describe('validateDto - CreateCoffeeOrderDto', () => {
    it('should pass validation with valid input', async () => {
      const validInput = {
        customer_name: 'John Doe',
        coffee_blend: 'latte',
      };

      const result = await validateDto(CreateCoffeeOrderDto, validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when customer_name is missing', async () => {
      const invalidInput = {
        coffee_blend: 'latte',
      };

      const result = await validateDto(CreateCoffeeOrderDto, invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.field === 'customer_name')).toBe(true);
    });

    it('should fail validation when customer_name is too short', async () => {
      const invalidInput = {
        customer_name: 'J',
        coffee_blend: 'latte',
      };

      const result = await validateDto(CreateCoffeeOrderDto, invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'customer_name' && e.message.includes('between 2 and 100'))).toBe(true);
    });

    it('should fail validation when customer_name is too long', async () => {
      const invalidInput = {
        customer_name: 'A'.repeat(101),
        coffee_blend: 'latte',
      };

      const result = await validateDto(CreateCoffeeOrderDto, invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'customer_name' && e.message.includes('between 2 and 100'))).toBe(true);
    });

    it('should fail validation when customer_name contains special characters', async () => {
      const invalidInput = {
        customer_name: 'John@Doe',
        coffee_blend: 'latte',
      };

      const result = await validateDto(CreateCoffeeOrderDto, invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'customer_name' && e.message.includes('letters, spaces, and hyphens'))).toBe(true);
    });

    it('should pass validation when customer_name contains spaces and hyphens', async () => {
      const validInput = {
        customer_name: 'Mary Jane-Smith',
        coffee_blend: 'cappuccino',
      };

      const result = await validateDto(CreateCoffeeOrderDto, validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when coffee_blend is missing', async () => {
      const invalidInput = {
        customer_name: 'John Doe',
      };

      const result = await validateDto(CreateCoffeeOrderDto, invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'coffee_blend')).toBe(true);
    });

    it('should fail validation when coffee_blend is invalid', async () => {
      const invalidInput = {
        customer_name: 'John Doe',
        coffee_blend: 'invalid_blend',
      };

      const result = await validateDto(CreateCoffeeOrderDto, invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'coffee_blend' && e.message.includes('must be one of'))).toBe(true);
    });

    it('should pass validation with all valid coffee blends', async () => {
      const validBlends = ['espresso', 'americano', 'latte', 'cappuccino', 'macchiato', 'mocha', 'cold_brew', 'frappuccino'];

      for (const blend of validBlends) {
        const validInput = {
          customer_name: 'John Doe',
          coffee_blend: blend,
        };

        const result = await validateDto(CreateCoffeeOrderDto, validInput);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should fail validation when body is null', async () => {
      const result = await validateDto(CreateCoffeeOrderDto, null);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'body')).toBe(true);
    });

    it('should fail validation when body is not an object', async () => {
      const result = await validateDto(CreateCoffeeOrderDto, 'not an object');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'body')).toBe(true);
    });

    it('should fail validation when payload exceeds 1KB', async () => {
      const largeInput = {
        customer_name: 'John Doe',
        coffee_blend: 'latte',
        extra_data: 'A'.repeat(1024),
      };

      const result = await validateDto(CreateCoffeeOrderDto, largeInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'body' && e.message.includes('exceeds maximum size'))).toBe(true);
    });
  });

  describe('validateDto - UpdateCoffeeOrderDto', () => {
    it('should pass validation with valid input', async () => {
      const validInput = {
        customer_name: 'John Doe',
        new_status: 'Completed',
      };

      const result = await validateDto(UpdateCoffeeOrderDto, validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass validation with optional coffee_blend', async () => {
      const validInput = {
        customer_name: 'John Doe',
        coffee_blend: 'mocha',
        new_status: 'Pending',
      };

      const result = await validateDto(UpdateCoffeeOrderDto, validInput);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with invalid status', async () => {
      const invalidInput = {
        customer_name: 'John Doe',
        new_status: 'InvalidStatus',
      };

      const result = await validateDto(UpdateCoffeeOrderDto, invalidInput);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'new_status' && e.message.includes('must be one of'))).toBe(true);
    });
  });

  describe('formatValidationErrorResponse', () => {
    it('should format errors correctly', () => {
      const errors = [
        { field: 'customer_name', message: 'Customer name is required' },
        { field: 'coffee_blend', message: 'Coffee blend must be valid' },
      ];

      const response = formatValidationErrorResponse(errors);

      expect(response).toEqual({
        error: 'Validation failed',
        details: errors,
      });
    });

    it('should handle empty errors array', () => {
      const errors: any[] = [];

      const response = formatValidationErrorResponse(errors);

      expect(response).toEqual({
        error: 'Validation failed',
        details: [],
      });
    });
  });
});
