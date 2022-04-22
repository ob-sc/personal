import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsEmail,
  Model,
  Table,
} from 'sequelize-typescript';
import Region from './Region';

@Table({ tableName: 'stations', timestamps: false })
class Station extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare address: string;

  @Column({ type: DataType.STRING })
  declare city: string;

  @Column({ type: DataType.INTEGER })
  declare zip: number;

  @Column({ type: DataType.STRING })
  declare telephone: string;

  @Column({ type: DataType.STRING })
  declare fax: string;

  @IsEmail
  @Column({ type: DataType.STRING })
  declare email: string;

  @ForeignKey(() => Region)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare region_id: number;

  @BelongsTo(() => Region, 'region_id')
  declare region: Region;

  @ForeignKey(() => Region)
  @Column({ type: DataType.INTEGER })
  declare subregion_id: number;

  @BelongsTo(() => Region, 'subregion_id')
  declare subregion: Region;
}

export default Station;
