import {
  ChangeEventHandler as CEH,
  FormEventHandler as FEH,
  MouseEventHandler as MEH,
  ReactNode,
} from 'react';

export type ChangeEventHandler = CEH<HTMLTextAreaElement | HTMLInputElement>;
export type FormEventHandler = FEH<HTMLFormElement>;
export type MouseEventHandler = MEH<
  HTMLButtonElement | HTMLAnchorElement | HTMLInputElement,
  HTMLImageElement
>;

export interface CProps {
  children?: ReactNode;
}
