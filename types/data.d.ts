// Formulare

export interface LoginForm {
  username: string;
  password: string;
}

export interface NewStationForm {
  id: string;
  name: string;
  address: string;
  zip: string;
  city: string;
  telephone: string;
  fax: string;
  email: string;
  region: string;
  subregion: string;
}

// DB

export interface RegionModel {
  id: number;
  name: string;
}

export interface StationModel {
  id: number;
  name: string;
  address: string;
  city: string;
  zip: number;
  telephone: string;
  fax: string;
  email: string;
  regions: RegionModel[];
}

export interface UserModel {
  id: number;
  username: string;
  access: number;
  region: RegionModel;
  stations: StationModel[];
}
