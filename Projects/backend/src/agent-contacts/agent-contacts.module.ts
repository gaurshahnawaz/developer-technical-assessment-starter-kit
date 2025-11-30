import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentContact } from './entities/agent-contact.entity';
import { AgentContactsService } from './agent-contacts.service';
import { AgentContactsController } from './agent-contacts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgentContact])],
  controllers: [AgentContactsController],
  providers: [AgentContactsService],
  exports: [AgentContactsService],
})
export class AgentContactsModule {}
