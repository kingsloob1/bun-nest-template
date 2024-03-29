import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn('bigint')
  id!: string | number;

  @Index()
  @CreateDateColumn()
  created_at!: Date;

  @Index()
  @UpdateDateColumn()
  updated_at!: Date;
}
