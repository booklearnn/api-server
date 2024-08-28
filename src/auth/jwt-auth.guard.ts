import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { BaseResponseType } from 'src/common/base-response';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (info instanceof TokenExpiredError) {
      throw new HttpException(
        {
          type: BaseResponseType.FAILURE,
          code: 'JE001', // jwt expired
          message: '토큰이 만료되었습니다.',
        },
        HttpStatus.OK,
      );
    }
    return user;
  }
}
