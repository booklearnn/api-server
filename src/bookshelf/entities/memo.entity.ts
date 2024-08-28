import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bookshelf } from './bookshelf.entity';

@Entity({ name: 'Memo', comment: '메모' })
export class Memo {
  @PrimaryGeneratedColumn()
  id: number;

  // bookshelf
  @ManyToOne(() => Bookshelf)
  @JoinColumn({ name: 'bookshelf_id' })
  bookshelf: Bookshelf;
  @Column('int', { name: 'bookshelf_id', comment: '책장 ID' })
  bookshelfId: number;

  @Column('int', { name: 'page', comment: '페이지' })
  page: number;

  @Column('text', { nullable: true, comment: '내용' })
  content?: string;

  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', comment: '수정일' })
  updatedAt: Date;
}
