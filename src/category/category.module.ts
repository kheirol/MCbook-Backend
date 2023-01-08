import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryController } from './category.controller';
import { BookEntity } from 'src/book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, BookEntity])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {
}
