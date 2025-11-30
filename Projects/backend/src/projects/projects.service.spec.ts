import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;

  const mockProject: Project = {
    id: '1',
    title: 'Green Valley Project',
    description: 'A modern residential development project',
    location: 'Al Khoud',
    developer: 'BuildCorp',
    totalUnits: 100,
    availableUnits: 50,
    startingPrice: 250000,
    status: 'ongoing',
    images: [],
    amenities: [],
    completionDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Project;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto: CreateProjectDto = {
        title: 'Green Valley Project',
        description: 'A modern residential development',
        location: 'Al Khoud',
        developer: 'BuildCorp',
        totalUnits: 100,
        availableUnits: 50,
        startingPrice: 250000,
        status: 'ongoing',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockProject);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProject);

      const result = await service.create(createProjectDto);

      expect(repository.create).toHaveBeenCalledWith(createProjectDto);
      expect(repository.save).toHaveBeenCalledWith(mockProject);
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return all projects without filters', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProject]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll();

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('project');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockProject]);
    });

    it('should filter projects by status', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProject]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { status: 'ongoing' };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProject]);
    });

    it('should apply limit to results', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProject]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { limit: 5 };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      expect(result).toEqual([mockProject]);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProject);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when project not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const updateProjectDto: UpdateProjectDto = {
        status: 'completed',
      };

      const updatedProject = { ...mockProject, ...updateProjectDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedProject);

      const result = await service.update('1', updateProjectDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.status).toBe('completed');
    });

    it('should throw NotFoundException when updating non-existent project', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockProject);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith(mockProject);
    });

    it('should throw NotFoundException when deleting non-existent project', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findPopular', () => {
    it('should return popular projects with ongoing status', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockProject, mockProject]);

      const result = await service.findPopular(6);

      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 'ongoing' },
        order: { createdAt: 'DESC' },
        take: 6,
      });
      expect(result.length).toBe(2);
    });

    it('should use default limit of 6', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await service.findPopular();

      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 'ongoing' },
        order: { createdAt: 'DESC' },
        take: 6,
      });
    });
  });
});
