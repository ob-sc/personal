// export type Route =
//   | 'directory'
//   | 'regions'
//   | 'sessions'
//   | 'stations'
//   | 'stations/new'
//   | 'temps'
//   | 'users';

// type RouteObject = { [key in Route]: number };

export const routes = {
  '/': 0,
  '/directory': 9,
  '/regions': 0,
  '/sessions': 0,
  '/stations': 0,
  '/stations/new': 4,
  '/temps': 1,
  '/users': 9,
  '/users/allowed': 9,
};

// todo alles niedrigen access und innerhalb der seite nach station / berechtigung freigeben?
// todo stationen haben immer ihre station berechtigt, inkl extrastationen und region. was ist mit verwaltung? immer alle aber keinen zugriff auf features ohne mindestens idl berechtigung?

/** Definiert die Berechtigungen. Für `hasAccess` werden beide Parameter benötigt, für translate nur `access` und für `routes` keiner. */
export function accessConstants(access: number) {
  const permitted = {
    '/': routes['/'] <= access,
    '/directory': routes['/directory'] <= access,
    '/regions': routes['/regions'] <= access,
    '/sessions': routes['/sessions'] <= access,
    '/stations': routes['/stations'] <= access,
    '/stations/new': routes['/stations/new'] <= access,
    '/temps': routes['/temps'] <= access,
    '/users': routes['/users'] <= access,
  };

  const translation = {
    '9': 'Admin',
    '4': 'Verwaltung',
    '3': 'GBL',
    '2': 'SL',
    '1': 'IDL',
  };
  const i = String(access) as keyof typeof translation;

  return {
    routes,
    permitted,
    translated: translation[i] || 'Dispo',
  };
}

export const errorText = 'Es ist ein Fehler aufgetreten';
