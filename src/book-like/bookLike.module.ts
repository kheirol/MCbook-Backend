import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { BookLikeEntity } from './bookLike.entity';
import { BookLikeService } from './bookLike.service';
import { BookLikeController } from './bookLike.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookLikeEntity,
    ]),
   UsersModule,
  ],
  providers: [
    BookLikeService,
  ],
  controllers: [BookLikeController],
  exports: [BookLikeService],
})
export class BookLikeModule {
}
