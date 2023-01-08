import { Injectable } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQuery, createPageInfo } from 'src/utils';
import { CreateCategoryDto } from './dto/create-carpart-category.dto';
import { BookEntity } from 'src/book/book.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(CategoryEntity) private repo: Repository<CategoryEntity>,
    @InjectRepository(BookEntity)
    private bookRepo: Repository<BookEntity>,
  ) {}

  async getCategories(query?: PaginationQuery) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);
    return createPageInfo(await this.repo.find({
      take: pageSize,
      skip: skip,
    }), pageSize, pageSize, skip)
  }

  async getCategory(id: number) {
    return this.repo.findOne({id})
  }

  async createCategory(createDto: CreateCategoryDto) {
    return this.repo.insert({
      ...createDto,
    })
  }

  async patchCategory(patchDto: CreateCategoryDto, id: number) {
    return this.repo.update({id}, {
      ...patchDto,
      
    })
  }
  async deleteCategory(id: number) {
    await this.bookRepo.update({categoryId: id}, {categoryId: 1})
    return this.repo.delete({id})
  }

}
