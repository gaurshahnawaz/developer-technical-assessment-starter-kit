import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Luxury Villa in Muscat' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Beautiful 4-bedroom villa with ocean view' })
  @IsString()
  description: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Al Mouj, Muscat' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'villa' })
  @IsString()
  type: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiProperty({ example: 350.5 })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ example: ['property1.jpg', 'property2.jpg'], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'available', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: ['pool', 'garden', 'parking'], required: false })
  @IsArray()
  @IsOptional()
  features?: string[];
}
