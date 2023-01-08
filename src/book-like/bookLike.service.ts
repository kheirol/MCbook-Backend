import { Injectable } from '@nestjs/common';
import { BookLikeEntity } from './bookLike.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookLikeService {
  constructor(
    @InjectRepository(BookLikeEntity)
    public repo: Repository<BookLikeEntity>,
  ) {}

  async like(bookId: number, userId: number) {
    return this.repo.insert({bookId, userId})
  }

  async unLike(bookId: number, userId: number) {
    return this.repo.delete({bookId, userId})
  }

  async isBookLiked(bookId: number, userId: number) {
    const match = await this.repo.findOne({bookId, userId})

    return !!match
  }

  async getBookTotalLikes(bookId: number) {
    const count = await this.repo.count({where: {bookId}})

    return count;
  }
}
