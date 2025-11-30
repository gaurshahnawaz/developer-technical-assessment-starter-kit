import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';

export class CreateAgentContactDto {
  @ApiProperty({ example: 'property', enum: ['property', 'land', 'project'] })
  @IsEnum(['property', 'land', 'project'])
  listingType: 'property' | 'land' | 'project';

  @ApiProperty()
  @IsUUID()
  listingId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
