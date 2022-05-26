import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { NULL } from 'src/common/utils/server';
import { User } from 'src/entities/User';

/**
 * C-Rent Daten, personell_nr ist nicht die richtige Personalnummer, nur C-Rent intern
 */
@Entity({ name: 'crent' })
export class Crent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  username!: string;

  @Column('int')
  personell_id!: number;

  @Column('int', { ...NULL })
  register_id!: number | null;

  // ---

  @OneToMany(() => User, (user) => user.crent)
  users!: Relation<User[]>;
}
