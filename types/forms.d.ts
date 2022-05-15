import { Entity } from 'server/database';

export type StringValueEntitiy = Record<keyof Entity, string>;

export type FormEntity = StringValueEntitiy | Partial<StringValueEntitiy>;

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
