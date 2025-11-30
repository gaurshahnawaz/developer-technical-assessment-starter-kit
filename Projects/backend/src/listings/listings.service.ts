import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { Land } from '../lands/entities/land.entity';
import { Project } from '../projects/entities/project.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);

  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(Land)
    private landsRepository: Repository<Land>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private cacheService: CacheService,
  ) {}

  async getPopular(limit: number = 6) {
    const cacheKey = `popular_listings_${limit}`;
    
    // Try to get from cache first
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache HIT for ${cacheKey}`);
      return cached;
    }

    this.logger.log(`Cache MISS for ${cacheKey} - fetching from database`);
    const startTime = Date.now();

    const itemsPerType = Math.ceil(limit / 3);

    // Fetch popular items from each type (most recent available ones)
    const [properties, lands, projects] = await Promise.all([
      this.propertiesRepository.find({
        where: { status: 'available' },
        order: { createdAt: 'DESC' },
        take: itemsPerType,
      }),
      this.landsRepository.find({
        where: { status: 'available' },
        order: { createdAt: 'DESC' },
        take: itemsPerType,
      }),
      this.projectsRepository.find({
        where: { status: 'ongoing' },
        order: { createdAt: 'DESC' },
        take: itemsPerType,
      }),
    ]);

    const result = {
      properties,
      lands,
      projects,
    };

    const duration = Date.now() - startTime;
    this.logger.log(`Database query took ${duration}ms`);

    // Store in cache for 5 minutes
    this.cacheService.set(cacheKey, result, 300);

    return result;
  }

  async search(query: string, type?: string) {
    const searchQuery = query.trim();
    if (!searchQuery) {
      return {
        properties: [],
        lands: [],
        projects: [],
      };
    }

    const searchFilters = type ? [type] : ['properties', 'lands', 'projects'];
    const results: any = {};

    if (searchFilters.includes('properties')) {
      results.properties = await this.propertiesRepository
        .createQueryBuilder('property')
        .where(
          `property.title LIKE :likeQuery OR 
           property.location LIKE :likeQuery OR
           property.type LIKE :likeQuery`,
          { 
            likeQuery: `%${searchQuery}%`
          }
        )
        .orderBy('property.created_at', 'DESC')
        .limit(20)
        .getMany();
    }

    if (searchFilters.includes('lands')) {
      results.lands = await this.landsRepository
        .createQueryBuilder('land')
        .where(
          `land.title LIKE :likeQuery OR 
           land.location LIKE :likeQuery OR
           land.zoning LIKE :likeQuery`,
          { 
            likeQuery: `%${searchQuery}%`
          }
        )
        .orderBy('land.created_at', 'DESC')
        .limit(20)
        .getMany();
    }

    if (searchFilters.includes('projects')) {
      results.projects = await this.projectsRepository
        .createQueryBuilder('project')
        .where(
          `project.title LIKE :likeQuery OR 
           project.location LIKE :likeQuery OR
           project.developer LIKE :likeQuery`,
          { 
            likeQuery: `%${searchQuery}%`
          }
        )
        .orderBy('project.created_at', 'DESC')
        .limit(20)
        .getMany();
    }

    return results;
  }
}
