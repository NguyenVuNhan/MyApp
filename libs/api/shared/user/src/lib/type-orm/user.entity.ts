import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Avatar } from './avatar.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @OneToOne(() => Avatar, (avatar: Avatar) => avatar.owner)
  @JoinColumn()
  public avatar: Avatar;
}
