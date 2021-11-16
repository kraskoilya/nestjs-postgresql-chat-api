import { User } from 'src/shared/models/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'chats' })
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('int', { default: 0 })
  unread_messages_count: number;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public created_by: User;

  @ManyToMany((type) => User, (user: User) => user.chats, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: Chat) {
    super();
  }
}
