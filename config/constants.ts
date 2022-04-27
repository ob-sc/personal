import { Route } from '../types/server';

/** `.check()` nur mit beiden Parametern, sonst false */
export function accessConstants(
  access?: number,
  route?: Route
): {
  translate: () => string;
  routes: { [key in Route]: number };
  check: () => boolean;
} {
  const routes = {
    sessions: 0,
    temps: 1,
    employees: 2,
    regions: 4,
    stations: 4,
    users: 9,
  };

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

  const check = () => (route && access ? routes[route] <= access : false);

  return {
    routes,
    translate,
    check,
  };
}
