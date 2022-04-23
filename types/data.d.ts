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
  region_id: string;
  subregion_id: string;
}
