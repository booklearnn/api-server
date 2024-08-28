import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { GetExtDto } from './dto/get-ext';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BooksService extends TypeOrmCrudService<Book> {
  constructor(
    @InjectRepository(Book)
    public repo: Repository<Book>,
    private readonly configService: ConfigService,
  ) {
    super(repo);
  }

  // 외부 도서 검색 API
  async getExt(dto: GetExtDto) {
    try {
      console.log({ ...dto });
      const ttbKey = this.configService.get('ttbkey');
      const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${dto.query}&QueryType=Title&MaxResults=${dto.maxResults}&start=${dto.start}&SearchTarget=Book&output=JS&Version=20131101&Cover=Big`;
      const result = await axios.get(url);
      return result.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getBookByIsbn(isbn: string) {
    try {
      const ttbKey = this.configService.get('ttbkey');
      const url = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${ttbKey}&itemIdType=ISBN&ItemId=${isbn}&output=JS&Version=20131101&Cover=Big`;
      const result = await axios.get(url);
      return result.data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
