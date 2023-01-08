import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { RoleType } from 'src/auth/roles.enum';
import { PaginationQuery } from 'src/utils';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-carpart-category.dto';

@Controller('category')
export class CategoryController {
  constructor(public service: CategoryService) {
  }

  @Get()
  get(@Query() query: PaginationQuery) {
    return this.service.getCategories(query)
  }

  @Get(":id")
  getOne(@Param('id') id: string) {
    return this.service.getCategory(Number(id))
  }

  @Auth(RoleType.admin)
  @Post()
  create(@Body() category: CreateCategoryDto) {
    return this.service.createCategory(category)
  }

  @Auth(RoleType.admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteCategory(Number(id))
  }

  @Auth(RoleType.admin)
  @Patch(':id')
  patch(@Body() category: CreateCategoryDto, @Param('id') id: string) {
    return this.service.patchCategory(category, Number(id))
  }


}