import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Region from './Region';

@Table
class Station extends Model {
  @Column({
    type: 'INT',
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: 'VARCHAR(255)',
    unique: true,
    allowNull: false,
  })
  name!: string;

  @Column({ type: 'VARCHAR(255)' })
  address!: string;

  @Column({ type: 'VARCHAR(255)' })
  city!: string;

  @Column({ type: 'INT' })
  zip!: number;

  @Column({ type: 'VARCHAR(255)' })
  telephone!: string;

  @Column({ type: 'VARCHAR(255)' })
  fax!: string;

  @Column({ type: 'VARCHAR(255)' })
  email!: string;

  @ForeignKey(() => Region)
  @Column({ type: 'INT', allowNull: false })
  region_id!: number;

  @BelongsTo(() => Region, 'region_id')
  region!: Region;

  @ForeignKey(() => Region)
  @Column({ type: 'INT' })
  subregion_id!: number;

  @BelongsTo(() => Region, 'subregion_id')
  subregion!: Region;
}

export default Station;
