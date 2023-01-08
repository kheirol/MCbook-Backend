import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AuthedRequest } from 'src/utils';
import { Auth } from 'src/auth/auth.decorator';
import { RoleType } from 'src/auth/roles.enum';
import { BookLikeService } from './bookLike.service';

@Controller('like')
export class BookLikeController {
  constructor(public service: BookLikeService) {
  }


  @Get("/book/:id")
  getLikes(@Param('id') id: string) {
    return this.service.getBookTotalLikes(Number(id))
  }
  
  @Auth(RoleType.normal)
  @Post(':id')
  like(@Param('id') id: string, @Req() request: AuthedRequest,) {
    return this.service.like(Number(id), request.user.id)
  }

  @Auth(RoleType.normal)
  @Post('/unlike/:id')
  unlike(@Param('id') id: string, @Req() request: AuthedRequest,) {
    return this.service.unLike(Number(id), request.user.id)
  }

  @Auth(RoleType.normal)
  @Post('/isLiked/:id')
  isLiked(@Param('id') id: string, @Req() request: AuthedRequest,) {
    return this.service.isBookLiked(Number(id), request.user.id)
  }

}
