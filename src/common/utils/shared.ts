import { errorText } from 'src/config/constants';
import { Entity, StringValueEntitiy } from 'src/entities';

export const isDev = process.env.NODE_ENV !== 'production';

export function prepend0(num: number) {
  return num < 10 ? `0${num}` : num;
}

export function toLocalDate(date: string | undefined | null) {
  if (typeof date !== 'string') return '';

  const dateInstance = new Date(date);

  if (Number.isNaN(dateInstance.getTime())) return errorText;

  const y = dateInstance.getFullYear();
  const m = dateInstance.getMonth();
  const d = dateInstance.getDate();

  // monat ist zero-indexed
  return `${prepend0(d)}.${prepend0(m + 1)}.${y}`;
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

export function nullOnEmpty(val: string | null | undefined) {
  return val === null || val === undefined || val.length === 0 ? null : val;
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
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function commaJoin(arr: string[]) {
  return arr.length === 0 ? '-' : arr.join(', ');
}

// neues objekt aus werten von entity, jeder wert ist string
// wird von form benutzt um zb bei PUT call leere werte in die form inputs einzufügen
export function formSafeEntity(obj: Entity | undefined) {
  if (!obj) return;
  const newObj: StringValueEntitiy = { id: String(obj.id) };

  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      newObj[key as keyof Entity] = '';
    } else newObj[key as keyof Entity] = val;
  }

  return newObj;
}
