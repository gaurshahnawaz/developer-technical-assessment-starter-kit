import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandsService } from './lands.service';
import { LandsController } from './lands.controller';
import { Land } from './entities/land.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Land])],
  controllers: [LandsController],
  providers: [LandsService],
  exports: [LandsService],
})
export class LandsModule {}
