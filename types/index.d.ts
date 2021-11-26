import * as React from 'react';

export type ChangeEventHandler = React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
export type FormEventHandler = React.FormEventHandler<HTMLFormElement>;

export interface CProps {
  children?: React.ReactNode;
}
