import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({ status: 201, description: 'Property created successfully', type: Property })
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties with optional pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of all properties', type: [Property] })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search query for title, description, or location' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Property type filter' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Location filter' })
  @ApiQuery({ name: 'bedrooms', required: false, type: Number, description: 'Number of bedrooms' })
  @ApiQuery({ name: 'bathrooms', required: false, type: Number, description: 'Number of bathrooms' })
  @ApiQuery({ name: 'minArea', required: false, type: Number, description: 'Minimum area in sq ft' })
  @ApiQuery({ name: 'maxArea', required: false, type: Number, description: 'Maximum area in sq ft' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Property status filter' })
  findAll(
    @Query('q') searchQuery?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('location') location?: string,
    @Query('bedrooms') bedrooms?: string,
    @Query('bathrooms') bathrooms?: string,
    @Query('minArea') minArea?: string,
    @Query('maxArea') maxArea?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      searchQuery,
      type,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      location,
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms, 10) : undefined,
      minArea: minArea ? parseFloat(minArea) : undefined,
      maxArea: maxArea ? parseFloat(maxArea) : undefined,
      status,
    };

    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 10;
      return this.propertiesService.findPaginated(pageNum, limitNum, filters);
    }
    return this.propertiesService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured properties' })
  @ApiResponse({ status: 200, description: 'List of featured properties', type: [Property] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items (default: 10)' })
  getFeatured(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.propertiesService.findFeatured(limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property by ID' })
  @ApiResponse({ status: 200, description: 'Property details', type: Property })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a property' })
  @ApiResponse({ status: 200, description: 'Property updated successfully', type: Property })
  @ApiResponse({ status: 404, description: 'Property not found' })
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a property' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
