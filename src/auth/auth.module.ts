import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { IdentitiesService } from 'src/users/identities.service';
import { MailService } from 'src/users/mail.service';
import { EmailAuth } from 'src/users/entities/email-auth.entity';
import { Identity } from 'src/users/entities/identity.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    // UsersModule,
    TypeOrmModule.forFeature([User, EmailAuth, Identity]),
    // UsersModule,
  ],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    UsersService,
    IdentitiesService,
    MailService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
