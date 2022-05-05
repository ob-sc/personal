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
interface Access {
  routes: RouteObject;
  hasAccess: boolean;
  translated: string;
}

/** Definiert die Berechtigungen. Für `hasAccess` werden beide Parameter benötigt, für translate nur `access` und für `routes` keiner. */
export function accessConstants(access?: number, route?: Route): Access {
  const routes: Record<Route, number> = {
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

  return {
    routes,
    hasAccess,
    translated: translate(),
  };
}

// todo alles niedrigen access und innerhalb der seite nach station / berechtigung freigeben?
