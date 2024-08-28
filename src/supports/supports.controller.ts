import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponseType } from 'src/common/base-response';
import { SupportDto } from 'src/users/dto/sign-up.dto';
import { MailService } from 'src/users/mail.service';

@ApiTags('Support')
@Controller('support')
export class SupportsController {
  constructor(private mailService: MailService) {}

  @ApiOperation({ summary: '문의하기' })
  @ApiBody({ type: SupportDto })
  @Post()
  async sendSupport(@Body() dto: SupportDto) {
    const category = dto.category;
    const content = dto.content;
    console.log(category, content);
    try {
      await this.mailService.sendMail(
        'booklearn.contact@gmail.com',
        `문의하기 - ${category}`,
        content,
      );
      return {
        type: BaseResponseType.SUCCESS,
        message: '문의하기 성공 🎉',
      };
    } catch (error) {
      console.log(error.message);
      return {
        type: BaseResponseType.FAILURE,
        message: '문의하기 실패 😥',
      };
    }
  }
}
