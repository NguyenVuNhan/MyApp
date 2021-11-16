import { Exclude } from 'class-transformer';
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

  @OneToOne(() => Avatar, (avatar: Avatar) => avatar.owner)
  @JoinColumn()
  public avatar: Avatar;

  @Column({ default: false })
  enabled2fa: boolean;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  secret2fa: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;
}
