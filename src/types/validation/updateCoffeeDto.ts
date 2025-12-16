import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateCoffeeDto {
  @IsNotEmpty({ message: 'Order ID is required' })
  @IsString({ message: 'Order ID must be a string' })
  order_id!: string;

  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString({ message: 'Customer name must be a string' })
  customer_name!: string;

  @IsNotEmpty({ message: 'New status is required' })
  @IsString({ message: 'New status must be a string' })
  @IsIn(['Pending', 'In Progress', 'Completed', 'Cancelled'], {
    message: 'Status must be one of: Pending, In Progress, Completed, Cancelled'
  })
  new_status!: string;
}
