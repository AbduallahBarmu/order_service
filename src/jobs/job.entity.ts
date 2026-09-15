import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobs')  // → creates a table called "jobs" in Postgres
export class Job {

  @PrimaryGeneratedColumn('uuid')  // → auto-generated UUID primary key
  id: string;

  @Column()  // → a regular VARCHAR column, NOT NULL by default
  title: string;

  @Column()
  company: string;

  @Column({ nullable: true })  // → this one CAN be null
  location: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })  // → TEXT instead of VARCHAR for longer content
  description: string;

  @CreateDateColumn()  // → auto-set to NOW() when the row is inserted
  createdAt: Date;

  @UpdateDateColumn()  // → auto-updated to NOW() on every save
  updatedAt: Date;
}