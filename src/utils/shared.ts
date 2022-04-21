export const isDev = process.env.NODE_ENV !== 'production';

export const unresolved = {
  api: {
    externalResolver: true,
  },
};

export const prepend0 = (num: number) => (num < 10 ? `0${num}` : num);

export const toLocalDate = (date: string | undefined | null) => {
  if (typeof date !== 'string') return '';

  const dateInstance = new Date(date);

  if (Number.isNaN(dateInstance.getTime())) return 'Fehler';

  const y = dateInstance.getFullYear();
  const m = dateInstance.getMonth();
  const d = dateInstance.getDate();

  // monat ist zero-indexed
  return `${prepend0(d)}.${prepend0(m + 1)}.${y}`;
};

export const redirectUrl = (url: string) => {
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
};

export const nullOnEmpty = (value: string | null | undefined) =>
  value === '' || value === undefined ? null : value;
