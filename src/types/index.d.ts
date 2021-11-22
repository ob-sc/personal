import * as React from 'react';

export type ChangeEventHandler = React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
export type FormEventHandler = React.FormEventHandler<HTMLFormElement>;

export type StringObject = { [key: string]: string };
export type Values = { [key: string]: string | undefined };
export type Errors = { [key: string]: Error | undefined };
export type Controller = {
  values: Values;
  setValue: (key: string, value?: string) => void;
  errors: Errors;
  setError: (key: string, error?: Error) => void;
};
