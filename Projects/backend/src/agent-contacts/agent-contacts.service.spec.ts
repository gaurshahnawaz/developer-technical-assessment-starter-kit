import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentContactsService } from './agent-contacts.service';
import { AgentContact } from './entities/agent-contact.entity';
import { CreateAgentContactDto } from './dto/create-agent-contact.dto';

describe('AgentContactsService', () => {
  let service: AgentContactsService;
  let repository: Repository<AgentContact>;

  const mockAgentContact: AgentContact = {
    id: '1',
    userId: 'user-1',
    listingId: 'property-1',
    listingType: 'property',
    message: 'I am interested in this property',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: undefined,
  } as unknown as AgentContact;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentContactsService,
        {
          provide: getRepositoryToken(AgentContact),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgentContactsService>(AgentContactsService);
    repository = module.get<Repository<AgentContact>>(
      getRepositoryToken(AgentContact),
    );
  });

  describe('helloWorld', () => {
    it('should return hello world', () => {
      const result = service.helloWorld();

      expect(result).toBe('hello world');
    });
  });

  describe('create', () => {
    it('should create a new agent contact', async () => {
      const createAgentContactDto: CreateAgentContactDto = {
        listingId: 'property-1',
        listingType: 'property',
        message: 'I am interested in this property',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockAgentContact);
      jest.spyOn(repository, 'save').mockResolvedValue(mockAgentContact);

      const result = await service.create('user-1', createAgentContactDto);

      expect(repository.create).toHaveBeenCalledWith({
        userId: 'user-1',
        ...createAgentContactDto,
      });
      expect(repository.save).toHaveBeenCalledWith(mockAgentContact);
      expect(result).toEqual(mockAgentContact);
    });
  });

  describe('findAll', () => {
    it('should return all agent contacts', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockAgentContact, mockAgentContact]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result.length).toBe(2);
    });

    it('should return empty array when no contacts exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByUser', () => {
    it('should return agent contacts for a specific user', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockAgentContact]);

      const result = await service.findByUser('user-1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' },
      });
      expect(result.length).toBe(1);
      expect(result[0].userId).toBe('user-1');
    });

    it('should return empty array when user has no contacts', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.findByUser('non-existent-user');

      expect(result).toEqual([]);
    });
  });
});
