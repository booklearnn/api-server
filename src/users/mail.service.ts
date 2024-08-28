// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // SMTP 설정
      host: 'smtp.gmail.com', //smtp 호스트
      port: 587,
      secure: false,
      auth: {
        user: '', // 보안을 위해 환경변수로 설정
        pass: '', // 보안을 위해 환경변수로 설정
      },
    });
  }

  async sendMail(email: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: 'booklearn.contact@gmail.com',
        to: email, //string or Array
        subject,
        text,
        /* 
        html: htmlData, //내용이 html이라면 text 대신 사용
        cc: [ex1@kigo.com, ex2@kigo.com] //참조
        attachments: attachments //첨부파일
        */
      });
      console.log('메일이 전송되었습니다');
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
    }
  }
}
