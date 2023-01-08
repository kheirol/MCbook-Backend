import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { BookController } from './book.controller';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/category.entity';
import { UsersModule } from '../users/users.module';
import { RentEntity } from 'src/rent/rent.entity';
import { BookLikeModule } from 'src/book-like/bookLike.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookEntity,
      CategoryEntity,
      RentEntity
    ]),
   UsersModule,
   BookLikeModule,
  ],
  providers: [
    BookService,
    CategoryService,
  ],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {
}
