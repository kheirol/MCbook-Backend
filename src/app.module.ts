import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { RentModule } from './rent/rent.module';
import { BookModule } from './book/book.module';
import { UsersModule } from './users/users.module';
import { DataBaseModule } from './database.config';
import { BookLikeModule } from './book-like/bookLike.module';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    CategoryModule,
    RentModule,
    BookModule,
    UsersModule,
    BookLikeModule,
    DataBaseModule,
  ],
})
export class AppModule {}
