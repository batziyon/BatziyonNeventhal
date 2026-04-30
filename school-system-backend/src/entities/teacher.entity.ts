import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn() 
  id!: number;

  @Column({ unique: true })
  idNumber!: string;

  @Column() 
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  grade!: string;

  @Column({ type: 'float', nullable: true })
  lat!: number;

  @Column({ type: 'float', nullable: true })
  lng!: number;
}