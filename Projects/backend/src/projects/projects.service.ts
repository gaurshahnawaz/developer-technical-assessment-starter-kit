import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return await this.projectsRepository.save(project);
  }

  async findAll(filters?: any): Promise<Project[]> {
    const query = this.projectsRepository.createQueryBuilder('project');

    if (filters?.status) {
      query.andWhere('project.status = :status', { status: filters.status });
    }

    query.orderBy('project.created_at', 'DESC');

    if (filters?.limit) {
      query.take(filters.limit);
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }

  async findPopular(limit: number = 6): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { status: 'ongoing' },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
