import { DataTypes, Model } from 'sequelize';

export interface StationAttributes {
  id: number;
  name: string;
  address: string;
  city: string;
  telephone: string;
  fax: string;
  email: string;
  region: string;
  subregion: string;
}

class Station extends Model<StationAttributes> implements StationAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public city!: string;
  public telephone!: string;
  public fax!: string;
  public email!: string;
  public region!: string;
  public subregion!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const stations = {
  id: {
    type: DataTypes.NUMBER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  telephone: { type: DataTypes.STRING },
  fax: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING },
  subregion: { type: DataTypes.STRING },
};

export default Station;
