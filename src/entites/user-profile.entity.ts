import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.profiles)
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @UpdateDateColumn()
  updated_at: Date;
}
