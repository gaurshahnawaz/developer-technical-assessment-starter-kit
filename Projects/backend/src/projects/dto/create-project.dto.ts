import { IsString, IsNumber, IsArray, IsOptional, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Al Mouj Golf Residences' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Luxury waterfront development with golf course' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Al Mouj, Muscat' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Oman Housing Bank' })
  @IsString()
  developer: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(0)
  totalUnits: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  availableUnits: number;

  @ApiProperty({ example: 180000 })
  @IsNumber()
  @Min(0)
  startingPrice: number;

  @ApiProperty({ example: ['project1.jpg', 'project2.jpg'], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'ongoing', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: ['swimming pool', 'gym', 'playground'], required: false })
  @IsArray()
  @IsOptional()
  amenities?: string[];

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsDateString()
  @IsOptional()
  completionDate?: Date;
}
