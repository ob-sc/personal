export const isDev = () => process.env.NODE_ENV !== 'production';

export const noArray = (query: string | string[]) => (Array.isArray(query) ? query[0] : query);

export const isEmpty = (value: string | undefined): boolean => value === '' || value === undefined;
