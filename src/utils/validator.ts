import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export async function validateRequest<T extends object>(
  dtoClass: new () => T,
  requestBody: any
): Promise<{ isValid: boolean; errors?: string[]; data?: T }> {
  const dtoInstance = plainToInstance(dtoClass, requestBody);
  const errors: ValidationError[] = await validate(dtoInstance);

  if (errors.length > 0) {
    const errorMessages = errors.flatMap(error => 
      error.constraints ? Object.values(error.constraints) : []
    );
    return { isValid: false, errors: errorMessages };
  }

  return { isValid: true, data: dtoInstance };
}
