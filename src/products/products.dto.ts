import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, ArrayMinSize, ValidateNested, IsOptional, IsNumber } from 'class-validator';

export class VariantDto {

    @IsString()
    @IsOptional()
    name: string | null;

    @IsOptional()
    price: number | null;

    // @IsString({ each: true })
    // image: string[];
  }

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsString({ each: true })
  // image: string[];

  @IsNumber()
  price: number;

  @IsEnum(['InStock', 'OutOfStock'])
  stock: 'InStock' | 'OutOfStock';

  @IsString()
  @IsNotEmpty()
  tax: string;

  // @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VariantDto) // Add this line
  variants: VariantDto[];

  @IsString({ each: true })
  specialTags: string[];

  @IsOptional()
  rating: number;

  @IsNotEmpty()
  nonVegetarian: boolean;
}
