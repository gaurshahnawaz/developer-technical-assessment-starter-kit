import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentContact } from './entities/agent-contact.entity';
import { CreateAgentContactDto } from './dto/create-agent-contact.dto';

@Injectable()
export class AgentContactsService {
  constructor(
    @InjectRepository(AgentContact)
    private agentContactsRepository: Repository<AgentContact>,
  ) {}

  helloWorld() {
    return 'hello world';
  }

  async create(userId: string, createAgentContactDto: CreateAgentContactDto): Promise<AgentContact> {
    const contact = this.agentContactsRepository.create({
      userId,
      ...createAgentContactDto,
    });
    return this.agentContactsRepository.save(contact);
  }

  async findAll(): Promise<AgentContact[]> {
    return this.agentContactsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<AgentContact[]> {
    return this.agentContactsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
