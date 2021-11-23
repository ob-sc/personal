import * as React from 'react';

export type ChangeEventHandler = React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
export type FormEventHandler = React.FormEventHandler<HTMLFormElement>;

export type ADUser = {
  displayName: string; // 'STARCAR GmbH - Ole Bergen'
  dn: string; // 'CN=SC - Bergen\\, Ole,OU=_IT,OU=_Flotte,OU=Verwaltung,OU=User,OU=STARCAR,DC=starcar,DC=local'
  mail: string; //  "ole.bergen@starcar.de"
  sAMAccountName: string; // 'bergen'
  sAMAccountType: string; // '805306368'
};
