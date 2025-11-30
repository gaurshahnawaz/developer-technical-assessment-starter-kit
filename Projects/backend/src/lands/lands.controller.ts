import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LandsService } from './lands.service';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { Land } from './entities/land.entity';

@ApiTags('lands')
@Controller('lands')
export class LandsController {
  constructor(private readonly landsService: LandsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new land listing' })
  @ApiResponse({ status: 201, description: 'Land created successfully', type: Land })
  create(@Body() createLandDto: CreateLandDto) {
    return this.landsService.create(createLandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all land listings with optional filters' })
  @ApiResponse({ status: 200, description: 'List of all lands', type: [Land] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items (default: all)' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Land status filter' })
  @ApiQuery({ name: 'zoning', required: false, type: String, description: 'Zoning type filter' })
  findAll(
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('zoning') zoning?: string,
  ) {
    const filters = {
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
      zoning,
    };
    return this.landsService.findAll(filters);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular land listings' })
  @ApiResponse({ status: 200, description: 'List of popular lands', type: [Land] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items (default: 6)' })
  getPopular(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 6;
    return this.landsService.findPopular(limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a land listing by ID' })
  @ApiResponse({ status: 200, description: 'Land details', type: Land })
  @ApiResponse({ status: 404, description: 'Land not found' })
  findOne(@Param('id') id: string) {
    return this.landsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a land listing' })
  @ApiResponse({ status: 200, description: 'Land updated successfully', type: Land })
  @ApiResponse({ status: 404, description: 'Land not found' })
  update(@Param('id') id: string, @Body() updateLandDto: UpdateLandDto) {
    return this.landsService.update(id, updateLandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a land listing' })
  @ApiResponse({ status: 200, description: 'Land deleted successfully' })
  @ApiResponse({ status: 404, description: 'Land not found' })
  remove(@Param('id') id: string) {
    return this.landsService.remove(id);
  }
}
