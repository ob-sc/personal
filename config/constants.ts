export const routes = {
  '/': 0,
  '/directory': 9,
  '/regions': 0,
  '/sessions': 0,
  '/stations': 0,
  '/stations/new': 4,
  '/temps': 1,
  '/users': 9,
  '/users/[id]/allowed': 9,
} as const;

export function accessConstants(access: number) {
  const permitted: Record<keyof typeof routes, boolean> = {
    '/': routes['/'] <= access,
    '/directory': routes['/directory'] <= access,
    '/regions': routes['/regions'] <= access,
    '/sessions': routes['/sessions'] <= access,
    '/stations': routes['/stations'] <= access,
    '/stations/new': routes['/stations/new'] <= access,
    '/temps': routes['/temps'] <= access,
    '/users': routes['/users'] <= access,
    '/users/[id]/allowed': routes['/users/[id]/allowed'] <= access,
  };

  const translation = {
    9: 'Admin',
    4: 'Verwaltung',
    3: 'GBL',
    2: 'SL',
    1: 'IDL',
  };

  return {
    routes,
    permitted,
    translated: translation[access as keyof typeof translation] || 'Dispo',
  };
}

export const errorText = 'Es ist ein Fehler aufgetreten';

export const noAccessText = 'Kein Zugriff auf diese Ressource';
