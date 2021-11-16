import { Chat } from 'src/modules/chats/chat.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  first_name: string;

  @Column('text')
  last_name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  passwordHash: string;

  @OneToOne(() => Chat, (chat: Chat) => chat.created_by)
  public createdChat: Chat;

  @ManyToMany((type) => Chat, (chat: Chat) => chat.users)
  public chats: Chat[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(data: User) {
    super();
  }
}
