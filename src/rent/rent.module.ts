import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentEntity } from './rent.entity';
import { RentController } from './rent.controller';
import { BookEntity } from 'src/book/book.entity';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([RentEntity, BookEntity]),
  BookModule,
  ],
  providers: [RentService],
  controllers: [RentController],
})
export class RentModule {}
