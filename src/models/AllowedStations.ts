import { Column, Model, Table } from 'sequelize-typescript';

@Table
class AllowedStations extends Model {
  @Column({ type: 'INT' })
  user_id!: number;

  @Column({ type: 'INT' })
  station_id!: string;
}

export default AllowedStations;
