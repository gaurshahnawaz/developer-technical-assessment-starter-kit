import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CacheService } from '../cache/cache.service';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('popular')
  @ApiOperation({ summary: 'Get popular listings from all categories (Cached for 5 minutes)' })
  @ApiResponse({ status: 200, description: 'Returns popular properties, lands, and projects' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Total number of items to return (default: 6)' })
  async getPopular(@Query('limit') limit?: string) {
    const itemLimit = limit ? parseInt(limit, 10) : 6;
    return this.listingsService.getPopular(itemLimit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search across all listing types with full-text search' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'type', required: false, enum: ['properties', 'lands', 'projects'], description: 'Filter by listing type' })
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
  ) {
    return this.listingsService.search(query, type);
  }

  @Get('cache/stats')
  @ApiOperation({ summary: 'Get cache performance statistics' })
  @ApiResponse({ status: 200, description: 'Returns cache hit rate and metrics' })
  getCacheStats() {
    return this.cacheService.getStats();
  }

  @Get('cache/clear')
  @ApiOperation({ summary: 'Clear cache (for testing)' })
  @ApiResponse({ status: 200, description: 'Cache cleared successfully' })
  clearCache() {
    this.cacheService.clear();
    return { message: 'Cache cleared successfully' };
  }
}
