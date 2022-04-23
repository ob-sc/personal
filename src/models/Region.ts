import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import Station from './Station';

@Table({ tableName: 'regions', timestamps: false })
class Region extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare name: string;

  @HasMany(() => Station, 'region_id')
  declare mainRegionStations: Station[];

  @HasMany(() => Station, 'subregion_id')
  declare subregionStations: Station[];
}

export default Region;
