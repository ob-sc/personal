import { Column, HasOne, HasMany, Model, Table } from 'sequelize-typescript';
import Region from './Region';
import Station from './Station';

@Table
class User extends Model {
  @Column({
    type: 'INT',
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: 'VARCHAR(255)',
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: 'INT',
  })
  access!: number;

  @HasOne(() => Region)
  @Column({
    type: 'INT',
  })
  region_id!: number;

  @Column({
    type: 'INT',
    allowNull: false,
  })
  station_id!: number;

  @HasMany(() => Station)
  @Column({
    type: 'JSONTYPE',
  })
  allowed_stations!: string;

  @Column({
    type: 'TINYINT',
    allowNull: false,
    defaultValue: 1,
  })
  active!: boolean;
}

export default User;
