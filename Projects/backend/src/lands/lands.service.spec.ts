import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { LandsService } from './lands.service';
import { Land } from './entities/land.entity';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';

describe('LandsService', () => {
  let service: LandsService;
  let repository: Repository<Land>;

  const mockLand: Land = {
    id: '1',
    title: 'Prime Land Plot',
    description: 'A prime land plot in central location',
    location: 'Seeb',
    price: 300000,
    area: 10000,
    zoning: 'residential',
    status: 'available',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Land;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandsService,
        {
          provide: getRepositoryToken(Land),
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

    service = module.get<LandsService>(LandsService);
    repository = module.get<Repository<Land>>(getRepositoryToken(Land));
  });

  describe('create', () => {
    it('should create a new land', async () => {
      const createLandDto: CreateLandDto = {
        title: 'Prime Land Plot',
        description: 'A prime land plot',
        location: 'Seeb',
        price: 300000,
        area: 10000,
        zoning: 'residential',
        status: 'available',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockLand);
      jest.spyOn(repository, 'save').mockResolvedValue(mockLand);

      const result = await service.create(createLandDto);

      expect(repository.create).toHaveBeenCalledWith(createLandDto);
      expect(repository.save).toHaveBeenCalledWith(mockLand);
      expect(result).toEqual(mockLand);
    });
  });

  describe('findAll', () => {
    it('should return all lands without filters', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockLand]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll();

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('land');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual([mockLand]);
    });

    it('should filter lands by status', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockLand]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { status: 'available' };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockLand]);
    });

    it('should filter lands by zoning', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockLand]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { zoning: 'residential' };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual([mockLand]);
    });

    it('should apply limit to results', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockLand]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const filters = { limit: 5 };
      const result = await service.findAll(filters);

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      expect(result).toEqual([mockLand]);
    });
  });

  describe('findOne', () => {
    it('should return a land by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockLand);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockLand);
    });

    it('should throw NotFoundException when land not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a land', async () => {
      const updateLandDto: UpdateLandDto = {
        price: 350000,
      };

      const updatedLand = { ...mockLand, ...updateLandDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockLand);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedLand);

      const result = await service.update('1', updateLandDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.price).toBe(350000);
    });

    it('should throw NotFoundException when updating non-existent land', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a land', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockLand);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockLand);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith(mockLand);
    });

    it('should throw NotFoundException when deleting non-existent land', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findPopular', () => {
    it('should return popular lands', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockLand, mockLand]);

      const result = await service.findPopular(6);

      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 'available' },
        order: { createdAt: 'DESC' },
        take: 6,
      });
      expect(result.length).toBe(2);
    });

    it('should use default limit of 6', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await service.findPopular();

      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 'available' },
        order: { createdAt: 'DESC' },
        take: 6,
      });
    });
  });
});
