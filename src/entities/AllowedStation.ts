import { Column, Entity } from 'typeorm';
import { NOT_NULL } from '../utils/server';

// @Table({ tableName: 'allowed_stations', timestamps: false })
@Entity()
export class AllowedStation {
  // @PrimaryGeneratedColumn()
  // id!: number;

  // @ForeignKey(() => User)
  @Column('int', { ...NOT_NULL })
  user_id!: number;

  // @ForeignKey(() => Station)
  @Column('int', { ...NOT_NULL })
  station_id!: string;
}

export default AllowedStation;
