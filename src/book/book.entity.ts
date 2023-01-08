import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBase64, IsNumber, IsPositive, IsString } from 'class-validator';
import { CategoryEntity } from '../category/category.entity';
import { RentEntity } from '../rent/rent.entity';

// export enum BookState {
//   Available,
//   ContactUs,
//   Disable,
//   Inquiry,
// }

@Entity()
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  dateCreated: string;

  @IsString({ always: true })
  // @Index({ fulltext: true })
  @Column({ length: 250 })
  name: string;

  @IsString()
  @Column({type:'longtext'})
  img: string;

  @ManyToOne(() => CategoryEntity, { cascade: true })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @IsNumber()
  @Column('int', {default: 1})
  categoryId: number;

  @OneToMany(() => RentEntity, rent => rent.book)
  rents: RentEntity;

  @IsPositive()
  @Column({ type: 'int' })
  capacity: number;

  @IsPositive()
  @Column({ type: 'int', default: 0 })
  totalRents: number;
}
