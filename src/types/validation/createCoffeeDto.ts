import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCoffeeDto {
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString({ message: 'Customer name must be a string' })
  @MinLength(2, { message: 'Customer name must be at least 2 characters long' })
  customer_name!: string;

  @IsNotEmpty({ message: 'Coffee blend is required' })
  @IsString({ message: 'Coffee blend must be a string' })
  @MinLength(3, { message: 'Coffee blend must be at least 3 characters long' })
  coffee_blend!: string;
}
