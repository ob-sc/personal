export type SuccessResponse =
  | { message: string }
  | Record<'string', unknown>
  | unknwon[]
  | null
  | undefined;

export type ErrorResponse = {
  message: string;
  field?: string;
};
