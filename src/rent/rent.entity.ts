import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserEntity } from '../users/users.entity';
import { BookEntity } from 'src/book/book.entity';

export enum RentState {
  Reserved, // user has requested an available book and the book is reserved for them 
  PickedUp, // user has picked up the book which they'd reserved
  Canceled, // request is cancelled either by the user or admin 
  Extended, // user has requested for another extension (they can only do it once)
  Done, // user has returned the book which they'd picked up some time ago
}

@Entity()
export class RentEntity {
  @IsOptional({ always: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column('int')
  userId: number;

  @Column('varchar')
  traceNumber: string;

  @IsEnum(RentState)
  @Column('int', { default: RentState.Reserved })
  state: RentState;

  @CreateDateColumn()
  dateCreated: string;

  @IsDate()
  @Column()
  dueDate: string;

  @ManyToOne(() => BookEntity, book => book.rents)
  @JoinColumn({name: 'bookId'})
  book: BookEntity;

  @Column('int')
  bookId: number;
  // @BeforeUpdate()
  // setTotalPriceUpdate() {
  //   this.totalPrice = this.cart.reduce((sum, cur) => {
  //     return sum + (cur.price || 0) * cur.quantity;
  //   }, 0);
  // }
}
