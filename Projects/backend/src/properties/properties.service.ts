import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertiesRepository.create(createPropertyDto);
    return await this.propertiesRepository.save(property);
  }

  async findAll(filters?: any): Promise<Property[]> {
    const query = this.propertiesRepository.createQueryBuilder('property');

    if (filters?.searchQuery) {
      query.andWhere(
        '(property.title LIKE :search OR property.description LIKE :search OR property.location LIKE :search)',
        { search: `%${filters.searchQuery}%` }
      );
    }
    if (filters?.type) {
      query.andWhere('property.type = :type', { type: filters.type });
    }
    if (filters?.minPrice) {
      query.andWhere('property.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters?.maxPrice) {
      query.andWhere('property.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    if (filters?.location) {
      query.andWhere('property.location LIKE :location', { location: `%${filters.location}%` });
    }
    if (filters?.bedrooms) {
      query.andWhere('property.bedrooms = :bedrooms', { bedrooms: filters.bedrooms });
    }
    if (filters?.bathrooms) {
      query.andWhere('property.bathrooms = :bathrooms', { bathrooms: filters.bathrooms });
    }
    if (filters?.minArea) {
      query.andWhere('property.area >= :minArea', { minArea: filters.minArea });
    }
    if (filters?.maxArea) {
      query.andWhere('property.area <= :maxArea', { maxArea: filters.maxArea });
    }
    if (filters?.status) {
      query.andWhere('property.status = :status', { status: filters.status });
    }

    return await query.orderBy('property.created_at', 'DESC').getMany();
  }

  async findPaginated(page: number = 1, limit: number = 10, filters?: any): Promise<{
    data: Property[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;
    
    const query = this.propertiesRepository.createQueryBuilder('property');

    if (filters?.searchQuery) {
      query.andWhere(
        '(property.title LIKE :search OR property.description LIKE :search OR property.location LIKE :search)',
        { search: `%${filters.searchQuery}%` }
      );
    }
    if (filters?.type) {
      query.andWhere('property.type = :type', { type: filters.type });
    }
    if (filters?.minPrice) {
      query.andWhere('property.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters?.maxPrice) {
      query.andWhere('property.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    if (filters?.location) {
      query.andWhere('property.location LIKE :location', { location: `%${filters.location}%` });
    }
    if (filters?.bedrooms) {
      query.andWhere('property.bedrooms = :bedrooms', { bedrooms: filters.bedrooms });
    }
    if (filters?.bathrooms) {
      query.andWhere('property.bathrooms = :bathrooms', { bathrooms: filters.bathrooms });
    }
    if (filters?.minArea) {
      query.andWhere('property.area >= :minArea', { minArea: filters.minArea });
    }
    if (filters?.maxArea) {
      query.andWhere('property.area <= :maxArea', { maxArea: filters.maxArea });
    }
    if (filters?.status) {
      query.andWhere('property.status = :status', { status: filters.status });
    }

    const [data, total] = await query
      .orderBy('property.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, updatePropertyDto);
    return await this.propertiesRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.propertiesRepository.remove(property);
  }

  async findFeatured(limit: number = 10): Promise<Property[]> {
    return await this.propertiesRepository.find({
      where: { status: 'available' },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
