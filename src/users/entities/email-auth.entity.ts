import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'EmailAuth' })
export class EmailAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 300, comment: '이메일' })
  email: string;

  @Column('varchar', { length: 6, comment: '인증 코드' })
  code: string;

  @Column('boolean', { default: false, comment: '인증 여부' })
  isCertified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
