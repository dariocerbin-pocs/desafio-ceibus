import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(0)
  price_cents!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
