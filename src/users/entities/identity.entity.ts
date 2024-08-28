import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ProviderType {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  APPLE = 'apple',
  LOCAL = 'local',
}

@Entity({ name: 'Identity', comment: 'Identity' })
export class Identity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    name: 'provider_type',
    length: 255,
    comment: '소셜 로그인 타입',
  })
  providerType: ProviderType;

  @Column('varchar', { length: 255 })
  identifier: string;

  @Column('varchar', { length: 255, nullable: true, comment: '이메일' })
  email?: string;

  @Column('varchar', { length: 300, nullable: true, comment: '비밀번호' })
  password?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;
  @Column('int', { name: 'user_id', nullable: true, comment: '사용자 ID' })
  userId?: number;

  @CreateDateColumn({ name: 'created_at', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일' })
  updatedAt: Date;
}
