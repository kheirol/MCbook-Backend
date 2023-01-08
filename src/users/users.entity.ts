import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('varchar', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

}
