import { Column, Model, Table } from 'sequelize-typescript';

@Table
class Region extends Model {
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
}

export default Region;
