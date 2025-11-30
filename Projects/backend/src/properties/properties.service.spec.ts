import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let repository: Repository<Property>;

  const mockProperty: Property = {
    id: '1',
    title: 'Beautiful Villa',
    description: 'A stunning villa in the heart of Muscat',
    location: 'Muscat',
    type: 'villa',
    price: 500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 5000,
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Property;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getRepositoryToken(Property),
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

    service = module.get<PropertiesService>(PropertiesService);
    repository = module.get<Repository<Property>>(getRepositoryToken(Property));
  });

  describe('create', () => {
    it('should create a new property', async () => {
      const createPropertyDto: CreatePropertyDto = {
        title: 'Beautiful Villa',
        description: 'A stunning villa',
        location: 'Muscat',
        type: 'villa',
        price: 500000,
        bedrooms: 4,
        bathrooms: 3,
        area: 5000,
        status: 'available',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockProperty);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProperty);

      const result = await service.create(createPropertyDto);

      expect(repository.create).toHaveBeenCalledWith(createPropertyDto);
      expect(repository.save).toHaveBeenCalledWith(mockProperty);
      expect(result).toEqual(mockProperty);
    });
  });

  describe('findAll', () => {
    it('should return all properties without filters', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll();

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('property');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by search query', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { searchQuery: 'villa' };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by type', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { type: 'villa' };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by price range', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { minPrice: 400000, maxPrice: 600000 };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by location', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { location: 'Muscat' };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by bedrooms', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { bedrooms: 4 };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by bathrooms', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { bathrooms: 3 };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by area range', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { minArea: 4000, maxArea: 6000 };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });

    it('should filter properties by status', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProperty]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { status: 'available' };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockProperty]);
    });
  });

  describe('findPaginated', () => {
    it('should return paginated properties', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockProperty], 1]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findPaginated(1, 10);

      expect(result.data).toEqual([mockProperty]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasMore).toBe(false);
    });

    it('should calculate pagination correctly', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [mockProperty, mockProperty],
          25,
        ]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findPaginated(1, 10);

      expect(result.totalPages).toBe(3);
      expect(result.hasMore).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a property by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProperty);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockProperty);
    });

    it('should throw NotFoundException when property not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a property', async () => {
      const updatePropertyDto: UpdatePropertyDto = {
        price: 550000,
      };

      const updatedProperty = { ...mockProperty, ...updatePropertyDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProperty);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedProperty);

      const result = await service.update('1', updatePropertyDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.price).toBe(550000);
    });

    it('should throw NotFoundException when updating non-existent property', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a property', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProperty);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockProperty);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith(mockProperty);
    });

    it('should throw NotFoundException when deleting non-existent property', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findFeatured', () => {
    it('should return featured properties', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockProperty, mockProperty]);

      const result = await service.findFeatured(10);

      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 'available' },
        order: { createdAt: 'DESC' },
        take: 10,
      });
      expect(result.length).toBe(2);
    });

    it('should use default limit of 10', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await service.findFeatured();

      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 'available' },
        order: { createdAt: 'DESC' },
        take: 10,
      });
    });
  });
});
