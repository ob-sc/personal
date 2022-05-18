import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UNIQUE } from 'src/common/utils/server';

/**
 * Um einzelne Float-Werte zu speichern
 */
@Entity({ name: 'floats' })
export class Float {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { ...UNIQUE })
  name!: string;

  @Column('float')
  value!: number;
}
