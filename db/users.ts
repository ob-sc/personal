import { DataTypes, Model } from 'sequelize';

export interface UserAttributes {
  id: string; // jacando id
  domain: string; // e.g. starcar
  username: string; // e.g. ole.bergen
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public domain!: string;
  public username!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const users = {
  id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  domain: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
};

export default User;
