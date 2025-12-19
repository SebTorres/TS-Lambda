import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorDetail[];
}

/**
 * Validates a plain object against a DTO class
 * @param dtoClass - The DTO class to validate against
 * @param body - The plain object to validate
 * @returns ValidationResult with isValid flag and error details
 */
export async function validateDto<T extends object>(
  dtoClass: new () => T,
  body: any
): Promise<ValidationResult> {
  // Check if body is present
  if (!body || typeof body !== 'object') {
    return {
      isValid: false,
      errors: [{ field: 'body', message: 'Request body is required and must be a valid JSON object' }],
    };
  }

  // Check payload size (max 1KB)
  const bodySize = JSON.stringify(body).length;
  if (bodySize > 1024) {
    return {
      isValid: false,
      errors: [{ field: 'body', message: 'Request payload exceeds maximum size of 1KB' }],
    };
  }

  // Transform plain object to class instance
  const dtoInstance = plainToClass(dtoClass, body);

  // Validate the instance
  const validationErrors: ValidationError[] = await validate(dtoInstance);

  if (validationErrors.length === 0) {
    return {
      isValid: true,
      errors: [],
    };
  }

  // Format validation errors
  const errors: ValidationErrorDetail[] = validationErrors.flatMap((error) => {
    if (error.constraints) {
      return Object.values(error.constraints).map((message) => ({
        field: error.property,
        message,
      }));
    }
    return [];
  });

  return {
    isValid: false,
    errors,
  };
}

/**
 * Creates a standardized error response for validation failures
 * @param errors - Array of validation error details
 * @returns Formatted error response object
 */
export function formatValidationErrorResponse(errors: ValidationErrorDetail[]) {
  return {
    error: 'Validation failed',
    details: errors,
  };
}
