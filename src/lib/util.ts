export const isDev = process.env.NODE_ENV !== 'production';

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

export const sanitizedLower = (str: string) => str.trim().toLowerCase();

export const createError = (err: unknown) => {
  if (err instanceof Error) return err;
  if (typeof err === 'string') return new Error(err);

  return new Error('Unbekannter Fehler');
};
