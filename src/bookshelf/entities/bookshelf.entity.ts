import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Book } from 'src/books/entities/book.entity';
import { Essay } from 'src/bookshelf/entities/essay.entity';
import { Memo } from 'src/bookshelf/entities/memo.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'Bookshelf', comment: '책장' })
export class Bookshelf {
  @PrimaryGeneratedColumn()
  id: number;

  // userId
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('int', { name: 'user_id', comment: '사용자 ID' })
  userId: number;

  // bookId
  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;
  @Column('int', { name: 'book_id', comment: '도서 ID' })
  bookId: number;

  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt: Date;

  // relations
  @OneToOne(() => Essay, (essay) => essay.bookshelf)
  essay?: Essay;

  @OneToMany(() => Memo, (memo) => memo.bookshelf)
  memos: Memo[];
}
