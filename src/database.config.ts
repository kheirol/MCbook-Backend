import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/users.entity';
import { BookEntity } from 'src/book/book.entity';
import { RentEntity } from './rent/rent.entity';
import { CategoryEntity } from './category/category.entity';
import { BookLikeEntity } from './book-like/bookLike.entity';

export const DataBaseModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'grace.iran.liara.ir',
  port: 33705,
  username: 'root',
  password: '0Cv8NBDxtxK9l3BUUxVXFvlf',
  database: 'priceless_beaver',
  // logging: true,
  charset: 'utf8mb4',
  entities: [
    UserEntity,
    RentEntity,
    BookEntity,
    CategoryEntity,
    BookLikeEntity
  ],
  synchronize: true,
});
