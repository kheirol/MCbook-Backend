import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { BookEntity } from 'src/book/book.entity';
import { UserEntity } from 'src/users/users.entity';

@Unique('user_post', ['userId', 'bookId'])
@Entity()
export class BookLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  dateCreated: string;

  @ManyToOne(() => BookEntity)
  @JoinColumn({ name: 'bookId' })
  book: BookEntity;

  @IsNumber()
  @Column('int')
  bookId: number;
  
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @IsNumber()
  @Column('int')
  userId: number;
}
