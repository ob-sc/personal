import { Column, Model, Table } from 'sequelize-typescript';

@Table
class Region extends Model {
  @Column({
    type: 'INT',
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: 'VARCHAR(255)',
    unique: true,
    allowNull: false,
  })
  name!: string;
}

export default Region;
