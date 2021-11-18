import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatar } from './avatar.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  @Column({ unique: true, nullable: true })
  public email?: string;

  @OneToOne(() => Avatar, (avatar: Avatar) => avatar.owner)
  @JoinColumn()
  public avatar: Avatar;

  @Column({ default: false })
  enabled2fa: boolean;

  @Column({ nullable: true })
  @Exclude()
  secret2fa: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;
}
