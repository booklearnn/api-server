import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Book', comment: '도서' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100, comment: '제목' })
  title: string;

  @Column('varchar', { length: 100, comment: '저자' })
  author: string;

  @Column('varchar', { length: 30, comment: '출판일' })
  pubDate: string;

  @Column('text', { nullable: true, comment: '설명' })
  desc: string;

  @Column('varchar', { length: 100, unique: true, comment: 'ISBN' })
  isbn: string;

  @Column('varchar', { length: 100, unique: true, comment: 'ISBN13' })
  isbn13: string;

  @Column('varchar', { length: 100, comment: '출판사' })
  publisher: string;

  @Column('varchar', {
    length: 500,
    nullable: true,
    comment: '도서 이미지 URL',
  })
  cover: string;

  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일' })
  updatedAt: Date;
}
