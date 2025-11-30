import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('properties')
export class Property {
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
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  type: string; // apartment, villa, townhouse, etc.

  @ApiProperty()
  @Column('int')
  bedrooms: number;

  @ApiProperty()
  @Column('int')
  bathrooms: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2 })
  area: number; // in square meters

  @ApiProperty()
  @Column('simple-array', { nullable: true })
  images: string[];

  @ApiProperty()
  @Column({ default: 'available' })
  status: string; // available, sold, reserved

  @ApiProperty()
  @Column('simple-array', { nullable: true })
  features: string[];

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
