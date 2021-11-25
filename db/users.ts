import { DataTypes, Model } from 'sequelize';

export interface UserAttributes {
  id: string; // jacando id
  domain: string; // e.g. starcar
  username: string; // e.g. ole.bergen
}

class User extends Model<UserAttributes> implements UserAttributes {
  id!: string;
  domain!: string;
  username!: string;
}

export const users = {
  id: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
  domain: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING },
};

export default User;
