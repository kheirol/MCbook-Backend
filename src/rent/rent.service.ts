import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RentEntity, RentState } from './rent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PaginationQuery, createPageInfo } from 'src/utils';
import { CreateRentDto } from './dto/create-rent.dto';
import { BookEntity } from 'src/book/book.entity';
import { BookService } from 'src/book/book.service';

@Injectable()
export class RentService {
  constructor(@InjectRepository(RentEntity) private repo:Repository<RentEntity>,
  @InjectRepository(BookEntity) private bookRepo:Repository<BookEntity>,
  private bookService: BookService,
  ) {}



  public async changeRentState(rentId: number, newState: RentState) {
    await this.repo.update({
      id: rentId,
    }, {
      state: newState,
    });
  }

  async getRents(query?: PaginationQuery) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);
    return createPageInfo(await this.repo.find({
      take: pageSize,
      skip: skip,
      relations: ['book', 'user'],
    }), pageSize, pageSize, skip)
  }
  
  async getUserRents(id: number, query?: PaginationQuery) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);
    return createPageInfo(await this.repo.find({
      take: pageSize,
      where: {userId: id},
      relations: ['book', 'user'],
      skip: skip,
    }), pageSize, pageSize, skip)
  }
  
  async getRentsByTraceNumber(traceNumber: string, query?: PaginationQuery) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);
    return createPageInfo(await this.repo.find({
      take: pageSize,
      where: {traceNumber: Like(`%${traceNumber}%`)},
      relations: ['book', 'user'],
      skip: skip,
    }), pageSize, pageSize, skip)
  }

  async getRent(id: number) {
    return this.repo.findOne({id})
  }

  async createRent(dto: CreateRentDto, userId: number) {

    if (! await this.bookService.isBookAvailable(dto.bookId)) throw new UnprocessableEntityException('Not available!')

    const traceNumber = `Rent-${Math.floor(Math.random() * 1000000000000000)}`

    const twoWeeksLater = new Date()
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

    return this.repo.insert({
      ...dto,
      traceNumber,
      userId,
      dueDate: twoWeeksLater.toISOString(),
    })
  }

  async confirmRent(rentId: number, bookId: number) {
    const twoWeeksLater = new Date()
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

    await this.repo.update({
      id: rentId,
    }, {
      state: RentState.PickedUp,
      dueDate: twoWeeksLater.toISOString(),
    })

    const book = await this.bookRepo.findOne({id: bookId})


    await this.bookRepo.update({
      id: bookId
    }, {
      totalRents: book.totalRents + 1,
    })
  }

  async cancelRent(rentId: number) {
    return this.repo.update({
      id: rentId,
    }, {
      state: RentState.Canceled
    })
  }

  async extendRent(rentId: number) {
    const item = await this.repo.findOne(rentId)

    const twoWeeksLater = new Date(item.dueDate)
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)

    return this.repo.update({
      id: rentId,
    }, {
      state: RentState.Extended,
      dueDate: twoWeeksLater.toISOString(),
    })
  }

}
