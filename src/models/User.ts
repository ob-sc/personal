import {
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import Region from './Region';
import Station from './Station';

@Table
class User extends Model {
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
  username!: string;

  @Column
  access!: number;

  @ForeignKey(() => Region)
  @Column
  region!: Region;

  @HasMany(() => Station)
  @Column
  stations!: Station[];
}

export default User;
