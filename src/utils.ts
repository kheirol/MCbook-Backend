import { IsNumberString, IsOptional } from 'class-validator';

export interface AuthedRequest extends Request {
  user: any;
}
export class Utils {
  private static bcrypt = require('bcrypt');

  static async hash(plaintextPassword: string) {
    const saltRounds = 10;
    return this.bcrypt.hash(plaintextPassword, saltRounds);
  }

  static async compareHash(hash1: any, hash2: any) {
    return this.bcrypt.compare(hash1, hash2);
  }

  static encode(str: string) {
    return str.split(' ').reverse().join(' ');
  }

  static formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  static randomNameGenerator() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g,
      () => Math.round(Math.random() * 16).toString(16));
  }
}
export interface PaginatedData<T> {
  data: Array<T>;
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

export class PaginationQuery {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  pageSize?: number;
}

export function createPageInfo<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number,
): PaginatedData<T> {
  return {
    data,
    count: data.length,
    total,
    page: Math.floor(offset / limit) + 1,
    pageCount: total ? Math.ceil(total / limit) : 1,
  };
}