import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @OneToOne(() => User, (user: User) => user.avatar)
  public owner: User;
}
