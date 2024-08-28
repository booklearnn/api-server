import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookshelfService } from './bookshelf.service';
import { BookshelfAddBookDto } from './dto/bookshelf-add-book.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { TokenPayload } from 'src/auth/types';
import { AuthTokenPayload } from 'src/auth/dto/validate-user.dto';
import { BaseResponseType } from 'src/common/base-response';
import { CreateEssayDto } from './dto/create-essay.dto';
import { CreateMemoDto } from './dto/create-memo.dto';

@ApiTags('Bookshelf')
@Controller('bookshelf')
export class BookshelfController {
  constructor(private bookshelfService: BookshelfService) {}

  @ApiOperation({ summary: '사용자 책장 조회 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getBookshelf(@User() user: TokenPayload) {
    try {
      const data = await this.bookshelfService.getBookshelfByUser(user.id);
      return {
        type: BaseResponseType.SUCCESS,
        data,
        code: 'BS000',
        message: '사용자 책장 조회 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '사용자 책장에 책 추가 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async addBook(
    @Body() dto: BookshelfAddBookDto,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.addBookByUser(dto, user.id);
      return {
        type: BaseResponseType.SUCCESS,
        message: '책장에 책 추가 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '책장 상세 조회 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:bookshelfId')
  async getBookshelfById(
    @Param('bookshelfId') bookshelfId: number,
    @User() user: AuthTokenPayload,
  ) {
    try {
      const data = await this.bookshelfService.getBookshelfById(
        +bookshelfId,
        user.id,
      );
      return {
        type: BaseResponseType.SUCCESS,
        data,
        code: 'BS002',
        message: '책장 상세 조회 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: '책장 삭제 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:bookshelfId')
  async deleteBookshelf(
    @Param('bookshelfId') bookshelfId: number,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.deleteBookshelf(bookshelfId, user.id);
      return {
        type: BaseResponseType.SUCCESS,
        code: 'BS005',
        message: '책장 삭제 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiTags('Essay')
  @ApiOperation({ summary: '에세이 작성 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:bookshelfId/essay')
  async createEssay(
    @Param('bookshelfId') bookshelfId: number,
    @Body() dto: CreateEssayDto,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.createEssay(bookshelfId, user.id, dto);
      return {
        type: BaseResponseType.SUCCESS,
        code: 'BS003',
        message: '에세이 작성 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiTags('Essay')
  @ApiOperation({ summary: '에세이 수정 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/:bookshelfId/essay/:essayId')
  async updateEssay(
    @Param('bookshelfId') bookshelfId: number,
    @Param('essayId') essayId: number,
    @Body() dto: CreateEssayDto,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.updateEssay(
        +bookshelfId,
        user.id,
        +essayId,
        dto,
      );
      return {
        type: BaseResponseType.SUCCESS,
        code: 'BS009',
        message: '에세이 수정 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiTags('Essay')
  @ApiOperation({ summary: '에세이 삭제 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:bookshelfId/essay/:essayId')
  async deleteEssay(
    @Param('bookshelfId') bookshelfId: number,
    @Param('essayId') essayId: number,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.deleteEssay(+bookshelfId, user.id, +essayId);
      return {
        type: BaseResponseType.SUCCESS,
        code: 'BS006',
        message: '에세이 삭제 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiTags('Memo')
  @ApiOperation({ summary: '메모 작성 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:bookshelfId/memo')
  async createMemo(
    @Param('bookshelfId') bookshelfId: number,
    @Body() dto: CreateMemoDto,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.createMemo(bookshelfId, user.id, dto);
      return {
        type: BaseResponseType.SUCCESS,
        code: 'BS004',
        message: '메모 작성 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiTags('Memo')
  @ApiOperation({ summary: '메모 수정 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/:bookshelfId/memo/:memoId')
  async updateMemo(
    @Param('bookshelfId') bookshelfId: number,
    @Param('memoId') memoId: number,
    @Body() dto: CreateMemoDto,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.updateMemo(
        +bookshelfId,
        user.id,
        +memoId,
        dto,
      );
      return {
        type: BaseResponseType.SUCCESS,
        code: 'BS008',
        message: '메모 수정 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }

  @ApiTags('Memo')
  @ApiOperation({ summary: '메모 삭제 API' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:bookshelfId/memo/:memoId')
  async deleteMemo(
    @Param('bookshelfId') bookshelfId: number,
    @Param('memoId') memoId: number,
    @User() user: AuthTokenPayload,
  ) {
    try {
      await this.bookshelfService.deleteMemo(+bookshelfId, user.id, +memoId);
      return {
        type: BaseResponseType.SUCCESS,
        code: 'BS007',
        message: '메모 삭제 성공 🎉',
      };
    } catch (error) {
      return {
        type: BaseResponseType.FAILURE,
        message: error.message,
      };
    }
  }
}
