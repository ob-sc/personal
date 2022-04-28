import { Route } from '../types/server';

type RouteObject = { [key in Route]: number };
interface Access {
  routes: RouteObject;
  hasAccess: boolean;
  translated: string;
}

/** Definiert die Berechtigungen. Für `hasAccess` werden beide Parameter benötigt, für translate nur `access` und für `routes` keiner. */
export function accessConstants(access?: number, route?: Route): Access {
  const routes = {
    sessions: 0,
    temps: 1,
    employees: 2,
    regions: 0,
    stations: 0,
    'stations/new': 4,
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
