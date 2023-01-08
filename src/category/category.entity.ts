import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsOptional, IsString } from 'class-validator';
import { BookEntity } from 'src/book/book.entity';

@Entity()
export class CategoryEntity {
  @IsOptional()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ length: 250, unique: true })
  name: string;

  @OneToMany(() => BookEntity, book => book.category, {})
  books: BookEntity[]
}
