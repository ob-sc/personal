export type JacandoAPI = (
  method: 'get' | 'post' | 'put' | 'delete',
  resource: string,
  data?: any
) => Promise<any>;

export interface CustomField {
  title: {
    de: string;
  };
  type: string;
  value: string;
}

export interface CustomFieldSection {
  names: {
    en?: string;
    de: string;
  };
  customFields: CustomField[];
}

export type APIUserStatus = 'idl' | 'sl' | 'rl' | 'admin';
export type APIUserRegion = 'hamburg' | 'berlin' | 'nord' | 'süd' | 'ost' | 'west' | 'mitte';

export interface APICustomFieldSection {
  names: {
    de: 'API';
  };
  customFields: [
    {
      title: {
        de: 'Kostenstelle';
      };
      type: 'number';
      value: string; // Stationsnummer
    },
    {
      title: {
        de: 'Status';
      };
      type: 'singleSelectDropdown';
      value: APIUserStatus;
    },
    {
      title: {
        de: 'Extrastation';
      };
      type: 'input';
      value: string; // * = alle, sonst KST getrennt durch Komma
    },
    {
      title: {
        de: 'Region';
      };
      type: 'singleSelectDropdown';
      value: APIUserRegion;
    }
  ];
}

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  personellNumber: string;
  clients: [{ id: string; name: string }];
  roles: [{ name: string }];
  updatedAt: string; // '2021-11-19T09:52:52.490Z'
  createdAt: string; // '2020-11-27T14:24:27.701Z'
  status: string; // 'active';
  publicEmail: string;
  imageUrl: string | null; // nicht sicher ob das stimmt, kein Bild zum testen
  archived: boolean;
  customFieldSections?: CustomFieldSection[];
}

export interface User extends Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  personellNumber: number;
  clients: [{ id: string; name: string }];
  roles: [{ name: string }];
  updatedAt: Date; // '2021-11-19T09:52:52.490Z'
  createdAt: Date; // '2020-11-27T14:24:27.701Z'
  status: string; // 'active';
  publicEmail: string;
  imageUrl: string | null;
  archived: boolean;
  kst: number; // Kostenstelle
  access: APIUserStatus | null;
  region: APIUserRegion | null;
  extrastation: number[] | '*' | null;
}

export interface Session extends User {
  username: string;
  isLoggedIn: boolean;
}
