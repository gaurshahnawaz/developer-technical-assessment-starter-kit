import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AgentContact } from '../../agent-contacts/entities/agent-contact.entity';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty()
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AgentContact, (contact) => contact.user)
  agentContacts: AgentContact[];
}
