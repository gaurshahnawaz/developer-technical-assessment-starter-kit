import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingsService } from './listings.service';
import { Property } from '../properties/entities/property.entity';
import { Land } from '../lands/entities/land.entity';
import { Project } from '../projects/entities/project.entity';
import { CacheService } from '../cache/cache.service';

describe('ListingsService', () => {
  let service: ListingsService;
  let propertiesRepository: Repository<Property>;
  let landsRepository: Repository<Land>;
  let projectsRepository: Repository<Project>;
  let cacheService: CacheService;

  const mockProperty: Property = {
    id: '1',
    title: 'Villa',
    location: 'Muscat',
    status: 'available',
    createdAt: new Date(),
  } as Property;

  const mockLand: Land = {
    id: '1',
    title: 'Land Plot',
    location: 'Seeb',
    status: 'available',
    createdAt: new Date(),
  } as Land;

  const mockProject: Project = {
    id: '1',
    title: 'Project',
    location: 'Al Khoud',
    status: 'ongoing',
    createdAt: new Date(),
  } as Project;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Property),
          useValue: {
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Land),
          useValue: {
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Project),
          useValue: {
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
    propertiesRepository = module.get<Repository<Property>>(
      getRepositoryToken(Property),
    );
    landsRepository = module.get<Repository<Land>>(getRepositoryToken(Land));
    projectsRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('getPopular', () => {
    it('should return cached popular listings if available', async () => {
      const cachedData = {
        properties: [mockProperty],
        lands: [mockLand],
        projects: [mockProject],
      };

      jest.spyOn(cacheService, 'get').mockReturnValue(cachedData);

      const result = await service.getPopular(6);

      expect(cacheService.get).toHaveBeenCalledWith('popular_listings_6');
      expect(result).toEqual(cachedData);
    });

    it('should fetch from database and cache if not cached', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      jest.spyOn(propertiesRepository, 'find').mockResolvedValue([mockProperty]);
      jest.spyOn(landsRepository, 'find').mockResolvedValue([mockLand]);
      jest.spyOn(projectsRepository, 'find').mockResolvedValue([mockProject]);
      jest.spyOn(cacheService, 'set').mockReturnValue(undefined);

      const result = await service.getPopular(6);

      expect(propertiesRepository.find).toHaveBeenCalled();
      expect(landsRepository.find).toHaveBeenCalled();
      expect(projectsRepository.find).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
      expect((result as any).properties).toEqual([mockProperty]);
      expect((result as any).lands).toEqual([mockLand]);
      expect((result as any).projects).toEqual([mockProject]);
    });

    it('should use default limit of 6', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      jest.spyOn(propertiesRepository, 'find').mockResolvedValue([]);
      jest.spyOn(landsRepository, 'find').mockResolvedValue([]);
      jest.spyOn(projectsRepository, 'find').mockResolvedValue([]);

      await service.getPopular();

      expect(cacheService.get).toHaveBeenCalledWith('popular_listings_6');
    });
  });

  describe('search', () => {
    it('should return empty results for empty search query', async () => {
      const result = await service.search('');

      expect(result).toEqual({
        properties: [],
        lands: [],
        projects: [],
      });
    });

    it('should search all types by default', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(propertiesRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);
      jest
        .spyOn(landsRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);
      jest
        .spyOn(projectsRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.search('villa');

      expect(propertiesRepository.createQueryBuilder).toHaveBeenCalled();
      expect(landsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(projectsRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should search only properties type when specified', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(propertiesRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.search('villa', 'properties');

      expect(propertiesRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.properties).toEqual([mockProperty]);
    });

    it('should search only lands type when specified', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockLand]),
      };

      jest
        .spyOn(landsRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.search('land', 'lands');

      expect(landsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.lands).toEqual([mockLand]);
    });

    it('should search only projects type when specified', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProject]),
      };

      jest
        .spyOn(projectsRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.search('project', 'projects');

      expect(projectsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.projects).toEqual([mockProject]);
    });
  });
});
