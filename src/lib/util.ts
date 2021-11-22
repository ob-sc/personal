export const isDev = () => process.env.NODE_ENV !== 'production';

export const errorResponse = (error: any) => ({
  error: error instanceof Error ? error.message : error,
});
