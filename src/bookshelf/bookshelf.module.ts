import { Module } from '@nestjs/common';
import { BookshelfController } from './bookshelf.controller';
import { BookshelfService } from './bookshelf.service';
import { BooksService } from 'src/books/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookshelf } from './entities/bookshelf.entity';
import { Essay } from './entities/essay.entity';
import { Memo } from './entities/memo.entity';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bookshelf, Essay, Memo]), BooksModule],
  controllers: [BookshelfController],
  providers: [BookshelfService],
})
export class BookshelfModule {}
