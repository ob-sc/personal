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
  address?: string | null;
  zip?: number | null;
  city?: string | null;
  telephone?: string | null;
  fax?: string | null;
  email?: string | null;
  region_id?: number;
  subregion_id?: number | null;
  region: RegionModel;
  subregion?: RegionModel;
}

export interface UserModel {
  id: number;
  username: string;
  access?: number;
  region?: RegionModel;
  stations?: StationModel[];
}

export interface AllowedStationsModel {
  user_id: number;
  station_id: number;
}
