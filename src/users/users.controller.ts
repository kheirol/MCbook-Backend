import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SignUpDto } from './dto/SignUp.dto';
import { LoginDto } from './dto/Login.dto';
import { Auth } from '../auth/auth.decorator';
import { RoleType } from '../auth/roles.enum';
import { UsersService } from './users.service';
import { AuthedRequest, Utils } from 'src/utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChargeDTO } from './dto/interfaces';
import { Patch } from '@nestjs/common';

@Controller('user')
export class UsersController {

  constructor(
    public service: UsersService,
    private readonly authService: AuthService,
  ) {
  }

  @Post('signUp')
  async signUp(@Body() createUser: SignUpDto): Promise<string> {
    const user = await this.service.findUser(createUser.email);
    if (user) {
      throw new ConflictException('user-exists');
    }
    createUser.password = await Utils.hash(createUser.password);
    await this.service.insertUser(createUser);
    return 'user-created';
  }

  @Post('login')
  async login(
    @Body() loginCredentials: LoginDto,
  ): Promise<string> {
    return this.service.login(this.authService, loginCredentials.email, loginCredentials.password);
  }


  @Auth(RoleType.normal)
  @Get('')
  async profile(
    @Req() request: AuthedRequest,
  ) {
    const { email } = request.user;
    const user = await this.service.findUser(email);
    if (!user) {
      throw new ForbiddenException('user-not-found');
    }
    return user;
  }

  @Auth(RoleType.normal)
  @Get('check/auth')
  async isUserLogin(@Req() request: AuthedRequest) {
    const user = await this.service.findUser(request.user.email)
    if (!user) return new UnauthorizedException()
    return user;
  }

  @Auth(RoleType.normal)
  @Patch()
  async updateUserProfile(
    @Req() request: AuthedRequest,
    @Body() dto: UpdateUserDto,
  ) {
    if (dto.password) dto.password = await Utils.hash(dto.password);
    await this.service.patchUser(dto, request.user.id);
    return 'done';
  }

  // @Auth(RoleType.normal)
  // @Post('charge')
  // async charge(
  //   @Req() request: AuthedRequest,
  //   @Body() dto: ChargeDTO,
  // ) {
  //   await this.service.addToBalance(request.user.id, dto.value);
  // }

  // @Auth(RoleType.normal)
  // @Post(':id/password')
  // async updateUserPassword(
  //   @Param('id') id,
  //   @Req() request: any,
  //   @Body() dto: UpdatePasswordDto,
  // ) {
  //   if (!request.user || request.user.id !== Number(id)) {
  //     throw new ForbiddenException();
  //   }
  //   const user = await this.service.findUser(request.user.email);
  //   if (!user) {
  //     throw new NotFoundException('user-not-found');
  //   }
  //   if (!await Utils.compareHash(dto.currentPassword, user.password)) {
  //     throw new ForbiddenException('wrong-password');
  //   }
  //   await this.service.updateUser({ email: request.user.email }, {
  //     password: await Utils.hash(dto.newPassword),
  //   });
  //   return 'done';
  // }
}
