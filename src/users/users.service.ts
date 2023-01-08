import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { ObjectID } from 'typeorm/driver/mongodb/typings';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { createPageInfo, PaginationQuery, Utils } from 'src/utils';
import { SignUpDto } from './dto/SignUp.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {
  }

  async getUsers(query?: PaginationQuery) {
    const pageSize = query?.pageSize || 10;
    const skip = pageSize * ((query?.page||1) - 1);
    return createPageInfo(await this.repo.find({
      take: pageSize,
      skip: skip,
    }), pageSize, pageSize, skip)
  }

  async getUser(id: number) {
    return this.repo.findOne({id})
  }

  async createUser(createDto: SignUpDto) {
    return this.repo.insert({
      ...createDto,
    })
  }

  async patchUser(patchDto: UpdateUserDto, id: number) {
    console.log(patchDto)
    return this.repo.update({id}, {
      ...patchDto,
    })
  }
  deleteUser(id: number) {
    return this.repo.delete({id})
  }
  
  public async login(authService: AuthService, email: string, password: string, isAdmin = false): Promise<string> {
    const user = await this.repo.findOne({ where: { email }, select: ['password', 'id', 'isAdmin'] });
    if (!user) {
      throw new NotFoundException('no-such-user');
    }
    if (await Utils.compareHash(password, user.password)) {
      if (isAdmin && !user.isAdmin) {
        throw new ForbiddenException('not-admin');
      }
      const token = await authService.login({ email, isAdmin: user.isAdmin, id: user.id });
      return token.access_token;
    }
    throw new ForbiddenException('wrong-password');
  }

  public async findUser(email: string): Promise<UserEntity> {
    return this.repo.findOne({ email });
  }

  public async find(conditions?: FindConditions<UserEntity> | FindManyOptions<UserEntity>): Promise<[UserEntity[], number]> {
    return this.repo.findAndCount(conditions as FindConditions<UserEntity>);
  }

  public async insertUser(entity: QueryDeepPartialEntity<UserEntity> | (QueryDeepPartialEntity<UserEntity>[])): Promise<InsertResult> {
    return this.repo.insert(entity);
  }

  // public async updateUser(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<UserEntity>,
  //   partialEntity: QueryDeepPartialEntity<UserEntity>): Promise<UpdateResult> {
  //   return this.repo.update(criteria, partialEntity);
  // }
}
