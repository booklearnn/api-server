import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Identity } from './identity.entity';
import { Bookshelf } from 'src/bookshelf/entities/bookshelf.entity';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'User', comment: '유저' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, comment: '이름' })
  name: string;

  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', comment: '삭제일(탈퇴일)' })
  deletedAt: Date;

  // relations
  @OneToMany(() => Identity, (identity) => identity.user)
  identities: Identity[];

  @OneToMany(() => Bookshelf, (bookshelf) => bookshelf.user)
  bookshelves: Bookshelf[];

  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
