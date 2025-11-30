import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../properties/entities/property.entity';
import { Land } from '../lands/entities/land.entity';
import { Project } from '../projects/entities/project.entity';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Land, Project])],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
