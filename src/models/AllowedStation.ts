import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Station from './Station';
import User from './User';

@Table({ tableName: 'allowed_stations', timestamps: false })
class AllowedStation extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare user_id: number;

  @ForeignKey(() => Station)
  @Column({ type: DataType.INTEGER })
  declare station_id: string;
}

export default AllowedStation;
