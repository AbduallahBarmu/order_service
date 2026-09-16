import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })   // no two users can have the same email
  email: string;

  @Column()
  password: string;            // will store the bcrypt hash, never plaintext

  @Column({ default: 'user' })
  role: string;                // 'user' or 'admin' — for later role-based access

  @CreateDateColumn()
  createdAt: Date;
}