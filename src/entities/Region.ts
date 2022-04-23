import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { NOT_NULL, UNIQUE } from '../utils/server';
import User from './User';

// todo was ist wenn ich region lösche aber user id noch hat? cascade?

// @Table({ tableName: 'regions', timestamps: false })
@Entity()
class Region {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('string', { ...UNIQUE, ...NOT_NULL })
  name!: string;

  // ---

  @OneToMany(() => User, (user) => user.id)
  users!: Relation<User[]>;
}

export default Region;
