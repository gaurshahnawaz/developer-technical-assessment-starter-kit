import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('projects')
export class Project {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  developer: string;

  @ApiProperty()
  @Column('int', { name: 'total_units' })
  totalUnits: number;

  @ApiProperty()
  @Column('int', { name: 'available_units' })
  availableUnits: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2, name: 'starting_price' })
  startingPrice: number;

  @ApiProperty()
  @Column('simple-array', { nullable: true })
  images: string[];

  @ApiProperty()
  @Column({ default: 'ongoing' })
  status: string; // ongoing, completed, upcoming

  @ApiProperty()
  @Column('simple-array', { nullable: true })
  amenities: string[];

  @ApiProperty()
  @Column({ type: 'date', nullable: true, name: 'completion_date' })
  completionDate: Date;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
