import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Land } from './entities/land.entity';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';

@Injectable()
export class LandsService {
  constructor(
    @InjectRepository(Land)
    private landsRepository: Repository<Land>,
  ) {}

  async create(createLandDto: CreateLandDto): Promise<Land> {
    const land = this.landsRepository.create(createLandDto);
    return await this.landsRepository.save(land);
  }

  async findAll(filters?: any): Promise<Land[]> {
    const query = this.landsRepository.createQueryBuilder('land');

    if (filters?.status) {
      query.andWhere('land.status = :status', { status: filters.status });
    }
    if (filters?.zoning) {
      query.andWhere('land.zoning = :zoning', { zoning: filters.zoning });
    }

    query.orderBy('land.created_at', 'DESC');

    if (filters?.limit) {
      query.take(filters.limit);
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Land> {
    const land = await this.landsRepository.findOne({ where: { id } });
    if (!land) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }
    return land;
  }

  async update(id: string, updateLandDto: UpdateLandDto): Promise<Land> {
    const land = await this.findOne(id);
    Object.assign(land, updateLandDto);
    return await this.landsRepository.save(land);
  }

  async remove(id: string): Promise<void> {
    const land = await this.findOne(id);
    await this.landsRepository.remove(land);
  }

  async findPopular(limit: number = 6): Promise<Land[]> {
    return await this.landsRepository.find({
      where: { status: 'available' },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
