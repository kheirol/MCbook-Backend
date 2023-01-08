import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookEntity } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQuery, createPageInfo } from 'src/utils';
import { SortQuery, DateQuery, CategoryQuery, NameQuery } from './dto/interface';
import { RentEntity, RentState } from 'src/rent/rent.entity';
import { BookLikeService } from 'src/book-like/bookLike.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity) public repo: Repository<BookEntity>,
    @InjectRepository(RentEntity) public rentRepo: Repository<RentEntity>,
    private likeService : BookLikeService,
    ) { }
  
  async getBooks( query: PaginationQuery & SortQuery & DateQuery & CategoryQuery, userId?: number) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);
    const res = await this.repo.find({
      // order: {sales: 'DESC'},
      where: query.category && {categoryId: Number(query.category)},
      take: pageSize,
      skip: skip,
      relations: ['category'],
    })

    const data = await Promise.all(res.map(async (item) => ({...item, 
      totalLikes: await this.likeService.getBookTotalLikes(item.id),
      liked: userId ? await this.likeService.isBookLiked(item.id, userId) : false,
      status: (await this.isBookAvailable(item.id)) ? 0 : 1 
    })))

    return createPageInfo(data, pageSize, pageSize, skip)
  }
  
  async getBooksByCategory(id: number,  query: PaginationQuery & SortQuery & DateQuery & CategoryQuery, userId?: number) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);

    const res = await this.repo.find({
      where: {categoryId: id},
      take: pageSize,
      skip: skip,
      relations: ['category'],
    })

    const data = await Promise.all(res.map(async (item) => ({...item, 
      totalLikes: await this.likeService.getBookTotalLikes(item.id),
      liked: userId ? await this.likeService.isBookLiked(item.id, userId) : false,
      status: (await this.isBookAvailable(item.id)) ? 0 : 1 
    })))

    return createPageInfo(data, pageSize, pageSize, skip)
  }

  async getBooksByName(name: string,  query: PaginationQuery & SortQuery & DateQuery & CategoryQuery & NameQuery, userId?: number) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);

    const res = await this.repo.find({
      where: {name: Like(`%${name}%`)},
      take: pageSize,
      skip: skip,
      relations: ['category'],
    })

    const data = await Promise.all(res.map(async (item) => ({...item, 
      totalLikes: await this.likeService.getBookTotalLikes(item.id),
      liked: userId ? await this.likeService.isBookLiked(item.id, userId) : false,
      status: (await this.isBookAvailable(item.id)) ? 0 : 1 
    })))

    return createPageInfo(data, pageSize, pageSize, skip)
  }

  async getBooksByRents(desc: boolean,  query: PaginationQuery & SortQuery & DateQuery & CategoryQuery, userId?: number) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);

    const res = await this.repo.find({
      order: {totalRents: desc ? "DESC" : "ASC"},
      where: query.category && {categoryId: Number(query.category)},
      take: pageSize,
      skip: skip,
      relations: ['category'],
    })

    const data = await Promise.all(res.map(async (item) => ({...item, 
      totalLikes: await this.likeService.getBookTotalLikes(item.id),
      liked: userId ? await this.likeService.isBookLiked(item.id, userId) : false,
      status: (await this.isBookAvailable(item.id)) ? 0 : 1 
    })))

    return createPageInfo(data, pageSize, pageSize, skip)
  }
  
  async getBooksByDate(query: PaginationQuery & SortQuery & DateQuery & CategoryQuery, userId?: number) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);
    const res = await this.repo.find({
      order: {dateCreated: 'DESC'},
      where: query.category && {categoryId: Number(query.category)},
      take: pageSize,
      skip: skip,
      relations: ['category']})

    const data = await Promise.all(res.map(async (item) => ({...item, 
      totalLikes: await this.likeService.getBookTotalLikes(item.id),
      liked: userId ? await this.likeService.isBookLiked(item.id, userId) : false,
      status: (await this.isBookAvailable(item.id)) ? 0 : 1 
    })))

    return createPageInfo(data, pageSize, pageSize, skip)
  }

  async getDaysLeftUntilAvailable(bookId: number) {

    if (this.isBookAvailable(bookId)) throw new ForbiddenException("Book is already available")

    const dates = await this.rentRepo.find({select: ['dueDate'], where: {bookId}})

    const now = Date.now()

    const latestDate = dates.map((item) => new Date(item.dueDate).getTime()).sort().reverse()[0]

    return (latestDate - now) / 1000 * 24 * 60 * 60
  }

  async isBookAvailable(bookId: number) {
    const book = await this.repo.findOne({select: ['capacity'], where: {id: bookId}})
    const pickedUpCount = await this.rentRepo.count({where: {bookId, state: In([RentState.Reserved ,RentState.PickedUp, RentState.Extended])}})

    return (book.capacity - pickedUpCount) > 0
  }

  async getBook(id: number) {
    return this.repo.findOne({id})
  }

  async createBook(createDto: CreateBookDto) {
    return this.repo.insert({
      ...createDto,
    })
  }

  async patchBook(patchDto: UpdateBookDto, id: number) {
    return this.repo.update({id}, {
      ...patchDto,

    })
  }
  deleteBook(id: number) {
    return this.repo.delete({id})
  }
}
