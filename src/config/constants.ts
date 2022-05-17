export const access = {
  empty: Buffer.from([0x00, 0x00]),
  admin: Buffer.from([0xff, 0xff]),
};

export const noAccessText = 'Kein Zugriff auf diese Ressource';
export const errorText = 'Es ist ein Fehler aufgetreten';
export const dbErrorText = 'Datenbank nicht verfügbar';
export const adErrorText = 'LDAP nicht verfügbar';
