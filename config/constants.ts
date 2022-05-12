export type Route =
  | 'directory'
  | 'regions'
  | 'sessions'
  | 'stations'
  | 'stations/new'
  | 'temps'
  | 'users'
  | 'users/allowed-stations';

type RouteObject = { [key in Route]: number };

// todo alles niedrigen access und innerhalb der seite nach station / berechtigung freigeben?
// todo stationen haben immer ihre station berechtigt, inkl extrastationen und region. was ist mit verwaltung? immer alle aber keinen zugriff auf features ohne mindestens idl berechtigung?

/** Definiert die Berechtigungen. Für `hasAccess` werden beide Parameter benötigt, für translate nur `access` und für `routes` keiner. */
export function accessConstants(access?: number, route?: Route) {
  const routes: RouteObject = {
    directory: 9,
    regions: 0,
    sessions: 0,
    stations: 0,
    'stations/new': 4,
    temps: 1,
    users: 9,
    'users/allowed-stations': 9,
  };

  const hasAccess =
    route !== undefined && access !== undefined
      ? routes[route] <= access
      : false;

  const translate = () =>
    access === 9
      ? 'Admin'
      : access === 4
      ? 'Verwaltung'
      : access === 3
      ? 'GBL'
      : access === 2
      ? 'SL'
      : access === 1
      ? 'IDL'
      : 'Dispo';

  const translated = translate();

  return {
    routes,
    hasAccess,
    translated,
  };
}

export const errorText = 'Es ist ein Fehler aufgetreten';
