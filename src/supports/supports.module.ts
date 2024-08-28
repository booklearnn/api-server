import { Module } from '@nestjs/common';
import { SupportsController } from './supports.controller';
import { MailService } from 'src/users/mail.service';

@Module({
  controllers: [SupportsController],
  providers: [MailService],
})
export class SupportsModule {}
