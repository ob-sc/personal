import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/entities/User';
import { NULL } from 'src/common/utils/server';

/**
 * Hardware für Benutzer
 */
@Entity({ name: 'hardware' })
export class Hardware {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('tinyint', { width: 1, default: 1 })
  mobile_phone!: 0 | 1;

  @Column('tinyint', { width: 1, default: 1 })
  laptop!: 0 | 1;

  @Column('tinyint', { width: 1, default: 1 })
  computer!: 0 | 1;

  @Column('varchar', { ...NULL })
  monitor!: string;

  @Column('tinyint', { width: 1, default: 1 })
  printer!: 0 | 1;

  @Column('tinyint', { width: 1, default: 1 })
  fuel_card!: 0 | 1;

  @Column('tinyint', { width: 1, default: 1 })
  ipad!: 0 | 1;

  @Column('varchar', { ...NULL })
  ipad_extra!: string;

  @Column('varchar', { ...NULL })
  other!: string;

  @Column('varchar', { ...NULL })
  authorization!: string;

  // ---

  @OneToMany(() => User, (user) => user.hardware)
  users!: Relation<User[]>;
}
