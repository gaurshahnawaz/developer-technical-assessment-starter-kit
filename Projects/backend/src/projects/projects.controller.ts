import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully', type: Project })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with optional filters' })
  @ApiResponse({ status: 200, description: 'List of all projects', type: [Project] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items (default: all)' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Project status filter' })
  findAll(
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
    };
    return this.projectsService.findAll(filters);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular projects' })
  @ApiResponse({ status: 200, description: 'List of popular projects', type: [Project] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items (default: 6)' })
  getPopular(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 6;
    return this.projectsService.findPopular(limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project details', type: Project })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully', type: Project })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
