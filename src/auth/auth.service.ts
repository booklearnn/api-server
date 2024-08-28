import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_KEY } from 'src/config/jwt.config';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async signIn(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);
    return {
      user: {
        id: user.id,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(user: Partial<User>) {
    const payload = { id: user.id, name: user.name };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get(JWT_KEY.ACCESS_SECRET_KEY),
      expiresIn: this.configService.get(JWT_KEY.ACCESS_EXPIRATION_TIME),
      // TOOD config
      issuer: 'booklearn', // TODO: our domain
    });
  }

  async generateRefreshToken(userId: number) {
    const payload = { id: userId };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get(JWT_KEY.REFRESH_SECRET_KEY),
      expiresIn: this.configService.get(JWT_KEY.REFRESH_EXPIRATION_TIME),
      // TOOD config
      issuer: 'booklearn', // TODO: our domain
    });
  }

  async refreshAccessToken(userId: number) {
    // revoke

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    if (user.deletedAt) throw new ForbiddenException('삭제된 사용자입니다.');

    // return new access token
    return await this.generateAccessToken(user);
  }
}

export type TokenUser = Pick<User, 'id'>;

export const loadLoggedInUser = (payload: TokenPayload): TokenUser => {
  const { id } = payload;
  return { id };
};
