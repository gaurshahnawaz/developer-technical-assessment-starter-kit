import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLandDto {
  @ApiProperty({ example: 'Prime Commercial Land in Muscat' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Ideal location for commercial development' })
  @IsString()
  description: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Muscat Hills' })
  @IsString()
  location: string;

  @ApiProperty({ example: 1000.5 })
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ example: 'commercial' })
  @IsString()
  zoning: string;

  @ApiProperty({ example: ['land1.jpg', 'land2.jpg'], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'available', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: ['corner lot', 'paved road access'], required: false })
  @IsArray()
  @IsOptional()
  features?: string[];
}
