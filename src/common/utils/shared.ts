import { FormValues } from 'src/common/components/Form';

export const isDev = process.env.NODE_ENV !== 'production';

export function toDeLocalDate(date: Date) {
  if (!(date instanceof Date)) return 'Fehler, kein Date-Objekt';
  return Intl.DateTimeFormat('de-DE').format(date);
}

export function redirectUrl(url: string) {
  if (url.includes('_next')) {
    const parts = url.split('/');

    // die ersten 4 weg, letztes element ist .json
    // bei /users/1 [ '', '_next', 'data', 'development', 'users', '1.json' ]
    // development wird in prod nur durch ein bundle getauscht?
    const slice = parts.slice(4);

    // home
    if (slice.length === 1 && slice[0] === 'index.json') return '/';

    const json = slice.at(-1);
    // hier muss es ein letztes element geben
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [ressource] = json!.split('.json');
    slice.pop();

    return [...slice, ressource !== 'index' ? ressource : undefined].join('/');
  }
  return url;
}

export function isEmpty(val: string | null | undefined) {
  return val === null || val === undefined || val.length === 0;
}

export function isNumber(val: string | number | null | undefined) {
  return val && !Number.isNaN(Number(val));
}

export function nullOnEmptyTrim(val: string | null | undefined) {
  return val === null || val === undefined || val.length === 0
    ? null
    : val.trim();
}

export function nullOnEmptyNum(val: string | null | undefined) {
  if (val === null || val === undefined || val.length === 0) return null;

  const num = Number(val);

  if (!isNumber(num)) return null;

  return num;
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function removeSpaces(str: string) {
  return str.replace(/\s+/g, '');
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  if (obj === null || obj === undefined) return false;
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function commaJoin(arr: string[]) {
  return arr.length === 0 ? '-' : arr.join(', ');
}

// neues objekt aus werten von entity, jeder wert ist string
// wird von form benutzt um zb bei PUT call leere werte in die form inputs einzufügen
// any ist okay, weil auf objekt getestet wird
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formSafeObject(obj: any) {
  const newObj: FormValues = {};

  const isObject =
    typeof obj === 'object' && !Array.isArray(obj) && obj !== null;

  if (!isObject) return newObj;

  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      newObj[key] = '';
    } else newObj[key] = String(val);
  }

  return newObj;
}
