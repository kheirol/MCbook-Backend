import { Body, Controller, ForbiddenException, Get, Param, Post, Query, Req, Request } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto, TraceNumberQuery } from './dto/create-rent.dto';
import { AuthedRequest, PaginationQuery } from 'src/utils';
import { Auth } from 'src/auth/auth.decorator';
import { RoleType } from 'src/auth/roles.enum';

@Controller('rent')
export class RentController {

  constructor(public service: RentService) {}

  @Auth(RoleType.admin)
  @Get()
  get(@Query() query: PaginationQuery) {
    return this.service.getRents(query)
  }

  @Auth(RoleType.normal)
  @Get('/user')
  getUserRents(@Query() query: PaginationQuery, @Req() request: AuthedRequest) {
    return this.service.getUserRents(request.user.id, query)
  }
  
  @Get('/trace')
  getByTraceNumber(@Query() query: PaginationQuery & TraceNumberQuery) {
    return this.service.getRentsByTraceNumber(query.traceNumber, query)
  }

  @Get(":id")
  getOne(@Param('id') id: string) {
    return this.service.getRent(Number(id))
  }
  
  @Auth(RoleType.normal)
  @Post()
  async createOne(
    @Body() dto: CreateRentDto,
    @Request() request: AuthedRequest,
  ) {
    if (!request.user.id) {
      throw new ForbiddenException('invalid-token');
    }
    return this.service.createRent(dto, request.user.id)
  }

  @Auth(RoleType.admin)
  @Post('confirm')
  async confirmRent(
    @Body() {rentId, bookId} : {rentId: number, bookId: number},
  ) {
    return this.service.confirmRent(rentId, bookId)
  }

  @Auth(RoleType.admin)
  @Post('cancel')
  async cancelRent(
    @Body() {rentId} : {rentId: number},
  ) {
    return this.service.cancelRent(rentId)
  }

  @Auth(RoleType.admin)
  @Post('extend')
  async extendRent(
    @Body() {rentId} : {rentId: number},
  ) {
    return this.service.extendRent(rentId)
  }

}