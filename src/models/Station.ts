import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import Region from './Region';

@Table
class Station extends Model {
  @Column({
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column({
    unique: true,
    allowNull: false,
  })
  name!: string;

  @Column
  address!: string;

  @Column
  city!: string;

  @Column
  zip!: number;

  @Column
  telephone!: string;

  @Column
  fax!: string;

  @Column
  email!: string;

  @HasMany(() => Region)
  @Column({ allowNull: false })
  regions!: Region[];
}

export default Station;
