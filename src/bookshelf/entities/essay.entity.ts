import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bookshelf } from './bookshelf.entity';

@Entity({ name: 'Essay', comment: '에세이' })
export class Essay {
  @PrimaryGeneratedColumn()
  id: number;

  // bookshelf
  @OneToOne(() => Bookshelf)
  @JoinColumn({ name: 'bookshelf_id' })
  bookshelf: Bookshelf;
  @Column('int', { name: 'bookshelf_id', comment: '책장 ID' })
  bookshelfId: number;

  @Column('text', { nullable: true, comment: '내용' })
  content?: string;

  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '최근 수정일' })
  updatedAt: Date;
}
