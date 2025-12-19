import { IsString, Length, Matches, IsIn, IsOptional } from 'class-validator';
import { VALID_COFFEE_BLENDS } from '../constants/coffeeBlends';

export class UpdateCoffeeOrderDto {
  @IsString({ message: 'Customer name must be a string' })
  @Length(2, 100, { message: 'Customer name must be between 2 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-]+$/, {
    message: 'Customer name can only contain letters, spaces, and hyphens',
  })
  customer_name!: string;

  @IsOptional()
  @IsString({ message: 'Coffee blend must be a string' })
  @IsIn(VALID_COFFEE_BLENDS, {
    message: `Coffee blend must be one of: ${VALID_COFFEE_BLENDS.join(', ')}`,
  })
  coffee_blend?: string;

  @IsOptional()
  @IsString({ message: 'Order status must be a string' })
  @IsIn(['Pending', 'Completed', 'Cancelled'], {
    message: 'Order status must be one of: Pending, Completed, Cancelled',
  })
  new_status?: string;
}
