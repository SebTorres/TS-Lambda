import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCoffeeDto {
  @IsNotEmpty({ message: 'Order ID is required' })
  @IsString({ message: 'Order ID must be a string' })
  order_id!: string;

  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString({ message: 'Customer name must be a string' })
  customer_name!: string;
}
