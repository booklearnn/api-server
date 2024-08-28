import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookshelf } from './entities/bookshelf.entity';
import { Repository } from 'typeorm';
import { BookshelfAddBookDto } from './dto/bookshelf-add-book.dto';
import { BooksService } from 'src/books/books.service';
import { CreateEssayDto } from './dto/create-essay.dto';
import { Essay } from './entities/essay.entity';
import { Memo } from './entities/memo.entity';
import { CreateMemoDto } from './dto/create-memo.dto';

@Injectable()
export class BookshelfService {
  constructor(
    @InjectRepository(Bookshelf)
    private bookshelfRepo: Repository<Bookshelf>,
    private bookService: BooksService,
    @InjectRepository(Essay)
    private essayRepo: Repository<Essay>,
    @InjectRepository(Memo)
    private memoRepo: Repository<Memo>,
  ) {}

  async addBookByUser(dto: BookshelfAddBookDto, userId: number) {
    // TODO: transaction
    // add book to db
    // addBook;
    let bookIds: number[] = [];
    for await (const isbn of dto.isbnList) {
      const book = await this.bookService.findOne({ where: { isbn } });
      if (!book) {
        const result = await this.bookService.getBookByIsbn(isbn);
        const data = result.item[0];
        const newBook = await this.bookService.repo.save({
          title: data.title,
          author: data.author,
          pubDate: data.pubDate,
          desc: data.description,
          isbn: data.isbn,
          isbn13: data.isbn13,
          publisher: data.publisher,
          cover: data.cover,
        });
        bookIds.push(newBook.id);
      } else {
        bookIds.push(book.id);
      }
      // await this.bookService.
      //   await this.addBook(dto);
    }

    // check limited bookshelf
    const bookshelfs = await this.bookshelfRepo.find({ where: { userId } });
    if (bookshelfs.length >= 100) {
      throw new ForbiddenException('책장은 100개까지만 추가할 수 있습니다.');
    }
    for await (const bookId of bookIds) {
      const existBook = await this.bookshelfRepo.findOne({
        where: { userId, bookId },
      });
      if (existBook) {
        throw new ForbiddenException('이미 책장에 추가된 책입니다.');
      }
      await this.bookshelfRepo.save({
        userId,
        bookId,
      });
    }
  }

  async getBookshelfByUser(userId: number) {
    return await this.bookshelfRepo.find({
      where: { userId },
      relations: ['book'],
      order: { id: 'DESC' },
    });
  }

  async getBookshelfById(bookshelfId: number, userId: number) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId, userId },
      relations: ['book', 'essay', 'memos'],
    });
    // sort only memos by id desc
    bookshelf.memos.sort((a, b) => b.id - a.id);
    return bookshelf;
  }

  async createEssay(bookshelfId: number, userId: number, dto: CreateEssayDto) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId, userId },
      relations: ['essay'],
    });
    if (!bookshelf) {
      throw new NotFoundException('책장을 찾을 수 없습니다.');
    }
    if (!bookshelf.essay) {
      await this.essayRepo.save({ bookshelfId, content: dto.content });
    } else {
      // 필요?
      await this.essayRepo.update(bookshelf.essay.id, {
        content: dto.content,
      });
    }
  }

  async updateEssay(
    bookshelfId: number,
    userId: number,
    essayId: number,
    dto: CreateEssayDto,
  ) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId, userId },
      relations: ['essay'],
    });
    if (!bookshelf) {
      throw new NotFoundException('책장을 찾을 수 없습니다.');
    }
    if (!bookshelf.essay) {
      throw new NotFoundException('에세이를 찾을 수 없습니다.');
    }
    if (bookshelf.essay.id !== essayId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    await this.essayRepo.update(essayId, {
      content: dto.content,
      updatedAt: new Date(),
    });
  }

  async deleteEssay(bookshelfId: number, userId: number, essayId: number) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId, userId },
      relations: ['essay'],
    });
    if (!bookshelf) {
      throw new NotFoundException('책장을 찾을 수 없습니다.');
    }
    if (!bookshelf.essay) {
      throw new NotFoundException('에세이를 찾을 수 없습니다.');
    }
    if (bookshelf.essay.id !== essayId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    await this.essayRepo.delete(essayId);
  }

  async createMemo(bookshelfId: number, userId: number, dto: CreateMemoDto) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId, userId },
      relations: ['memos'],
    });
    if (!bookshelf) {
      throw new NotFoundException('책장을 찾을 수 없습니다.');
    }
    if (bookshelf.memos.length >= 100) {
      throw new ForbiddenException('메모는 100개까지만 추가할 수 있습니다.');
    }
    if (dto.page === undefined) {
      dto.page = 0;
    }
    await this.memoRepo.save({ bookshelfId, ...dto });
  }

  async deleteMemo(bookshelfId: number, userId: number, memoId: number) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId, userId },
      relations: ['memos'],
    });
    if (!bookshelf) {
      throw new NotFoundException('책장을 찾을 수 없습니다.');
    }
    const memo = bookshelf.memos.find((memo) => memo.id === memoId);
    if (!memo) {
      throw new NotFoundException('메모를 찾을 수 없습니다.');
    }
    await this.memoRepo.delete(memoId);
  }

  async updateMemo(
    bookshelfId: number,
    userId: number,
    memoId: number,
    dto: CreateMemoDto,
  ) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId, userId },
      relations: ['memos'],
    });
    if (!bookshelf) {
      throw new NotFoundException('책장을 찾을 수 없습니다.');
    }
    const memo = bookshelf.memos.find((memo) => memo.id === memoId);
    if (!memo) {
      throw new NotFoundException('메모를 찾을 수 없습니다.');
    }
    await this.memoRepo.update(memoId, { ...dto, updatedAt: new Date() });
  }

  async deleteBookshelf(bookshelfId: number, userId: number) {
    const bookshelf = await this.bookshelfRepo.findOne({
      where: { id: bookshelfId },
      relations: ['essay', 'memos'],
    });
    if (!bookshelf) {
      throw new NotFoundException('책장을 찾을 수 없습니다.');
    }
    if (bookshelf.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    if (bookshelf.essay) {
      await this.essayRepo.delete(bookshelf.essay.id);
    }
    if (bookshelf.memos.length > 0) {
      await this.memoRepo.delete(bookshelf.memos.map((memo) => memo.id));
    }
    await this.bookshelfRepo.delete(bookshelfId);
  }
}
