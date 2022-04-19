export type SuccessResponse =
  | { message: string }
  | object
  | object[]
  | null
  | undefined;

export type ErrorResponse = {
  message: string;
  field?: string;
};
