// src/members/entities/member.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Loan } from '../../loans/entities/loan.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid', { name: 'member_id' })
  member_id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;
  
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  membership_date: string;

  @OneToMany(() => Loan, (loan) => loan.member)
  loans: Loan[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
