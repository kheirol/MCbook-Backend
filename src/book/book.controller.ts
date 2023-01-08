import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { AuthedRequest, PaginationQuery } from 'src/utils';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CategoryQuery, DateQuery, NameQuery, SortEnum, SortQuery } from './dto/interface';
import { Auth } from 'src/auth/auth.decorator';
import { RoleType } from 'src/auth/roles.enum';

@Controller('book')
export class BookController {
  constructor(public service: BookService) {
  }

  // @Get()
  // get(@Query() query: PaginationQuery) {
  //   return this.service.getBooks(query)
  // }

  @Auth(RoleType.optional)
  @Get()
  getFiltered(
    @Query()
    query: PaginationQuery & SortQuery & DateQuery & CategoryQuery & NameQuery,
    @Req() request: AuthedRequest
  ) {
    if (query.name)
      return this.service.getBooksByName(query.name, query, request.user.id);
    else if (query.sort === SortEnum.RentsHigh)
      return this.service.getBooksByRents(true, query, request.user.id);
    else if (query.sort === SortEnum.RentsLow)
      return this.service.getBooksByRents(false, query, request.user.id);
    else if (query.category)
      return this.service.getBooksByCategory(Number(query.category), query, request.user.id);
    return this.service.getBooksByDate(query, request.user.id);
  }

  
  @Get(":id")
  getOne(@Param('id') id: string) {
    return this.service.getBook(Number(id))
  }
  
  @Get("isAvailable/:id")
  isAvilable(@Param('id') id: string) {
    return this.service.isBookAvailable(Number(id))
  }

  @Get("ETA/:id")
  getDaysTillAvailable(@Param('id') id: string) {
    return this.service.getDaysLeftUntilAvailable(Number(id))
  }
  
  @Auth(RoleType.admin)
  @Post()
  create(@Body() book: CreateBookDto) {
    return this.service.createBook(book)
  }
  
  @Auth(RoleType.admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteBook(Number(id))
  }
  
  @Auth(RoleType.admin)
  @Patch(':id')
  patch(@Body() book: UpdateBookDto, @Param('id') id: string) {
    return this.service.patchBook(book, Number(id))
  }

}
