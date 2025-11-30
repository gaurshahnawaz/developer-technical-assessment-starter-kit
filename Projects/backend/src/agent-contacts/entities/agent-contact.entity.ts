import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('agent_contacts')
export class AgentContact {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty()
  @Column({ name: 'listing_type' })
  listingType: 'property' | 'land' | 'project';

  @ApiProperty()
  @Column({ name: 'listing_id' })
  listingId: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  message: string;

  @ApiProperty()
  @Column({ default: 'pending' })
  status: 'pending' | 'contacted' | 'closed';

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.agentContacts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
