import {
  ChangeEventHandler as CEH,
  FormEventHandler as FEH,
  MouseEventHandler as MEH,
  MouseEvent,
  ReactNode as RN,
  SyntheticEvent,
} from 'react';
import {
  GridCallbackDetails,
  GridCellParams,
  GridColDef,
  GridRowParams,
  MuiEvent,
} from '@mui/x-data-grid';

export type ReactNode = RN;
export type ChangeEventHandler = CEH<HTMLTextAreaElement | HTMLInputElement>;
export type FormEventHandler = FEH<HTMLFormElement>;
export type MouseEventHandler = MEH<
  HTMLButtonElement | HTMLAnchorElement | HTMLInputElement,
  HTMLImageElement
>;

export interface CProps {
  children?: ReactNode;
}

// Form

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'password' | 'date' | 'header';
}

// DataGrid

export interface GridCol extends GridColDef {
  sm?: boolean;
}

export type RowClickHandler = (
  params: GridRowParams<{
    [key: string]: unknown;
  }>,
  event: MuiEvent<SyntheticEvent<Element, Event>>,
  details: GridCallbackDetails
) => void;

export type CellClickHandler = (
  params: GridCellParams,
  event: MuiEvent<MouseEvent<Element, globalThis.MouseEvent>>,
  details: GridCallbackDetails
) => void;

// MultiSelect Options

export type SelectOption = { optval: number | string; optlabel: string };
