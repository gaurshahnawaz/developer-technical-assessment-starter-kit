import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AgentContactsService } from './agent-contacts.service';
import { CreateAgentContactDto } from './dto/create-agent-contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('agent-contacts')
@Controller('agent-contact')
export class AgentContactsController {
  constructor(private readonly agentContactsService: AgentContactsService) {}

  helloWorld() {
    return 'hello world';
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create agent contact request (Protected)' })
  @ApiResponse({ status: 201, description: 'Contact request created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Request() req: any, @Body() createAgentContactDto: CreateAgentContactDto) {
    return this.agentContactsService.create(req.user.userId, createAgentContactDto);
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my contact requests (Protected)' })
  @ApiResponse({ status: 200, description: 'Returns user contact requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyRequests(@Request() req: any) {
    return this.agentContactsService.findByUser(req.user.userId);
  }
}
