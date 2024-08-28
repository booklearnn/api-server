import { Crud, CrudController } from '@dataui/crud';
import {
  Controller,
  DefaultValuePipe,
  Get,
  Optional,
  ParseBoolPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { BaseResponse, BaseResponseType } from 'src/common/base-response';

@ApiTags('Book')
@Crud({
  model: { type: Book },
  routes: { only: ['getManyBase', 'getOneBase'] },
})
@Controller({ path: 'books' })
export class BooksController implements CrudController<Book> {
  constructor(public service: BooksService) {}

  @ApiOperation({ summary: '외부 도서 검색 API' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: '검색어',
  })
  @ApiQuery({
    name: 'maxResults',
    required: false,
    description: '결과 개수',
    example: 10,
  })
  @ApiQuery({
    name: 'start',
    required: false,
    description: '시작 위치',
    example: 1,
  })
  @Get('get-ext')
  async extra(
    @Query('query') query: string,
    @Query('maxResults') maxResults?: number,
    @Query('start') start?: number,
  ): Promise<BaseResponse> {
    try {
      const data = await this.service.getExt({
        query,
        maxResults: !maxResults ? 10 : +maxResults,
        start: !start ? 1 : +start,
      });
      return { type: BaseResponseType.SUCCESS, data };
    } catch (error) {
      return { type: BaseResponseType.FAILURE, message: error.message };
    }
  }

  @Get('get-ext-isbn')
  async extraIsbn(@Query('isbn') isbn: string): Promise<BaseResponse> {
    try {
      const data = await this.service.getBookByIsbn(isbn);
      return { type: BaseResponseType.SUCCESS, data };
    } catch (error) {
      return { type: BaseResponseType.FAILURE, message: error.message };
    }
  }
}
