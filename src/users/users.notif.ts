import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UsersNotif {
  constructor(private mailService: MailService) {}

  @OnEvent('signup')
  async congratulateUserSignUp(email: string) {
    await this.mailService.sendMail(
      email,
      '회원가입을 축하합니다!',
      '회원가입을 축하합니다!',
    );
  }
}
