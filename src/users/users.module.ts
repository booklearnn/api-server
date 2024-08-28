import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Identity } from './entities/identity.entity';
import { IdentitiesService } from './identities.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from './mail.service';
import { EmailAuth } from './entities/email-auth.entity';
import { UsersNotif } from './users.notif';

@Module({
  imports: [TypeOrmModule.forFeature([User, Identity, EmailAuth]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, IdentitiesService, MailService, UsersNotif],
  exports: [UsersService],
})
export class UsersModule {}
