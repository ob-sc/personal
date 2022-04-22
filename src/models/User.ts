import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import AllowedStation from './AllowedStation';
import Region from './Region';
import Station from './Station';

@Table({ tableName: 'users', timestamps: false })
class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare access: number;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
  })
  declare region_id: number;

  @HasMany(() => AllowedStation)
  stations!: Station[];

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
  })
  declare active: boolean;
}

export default User;
