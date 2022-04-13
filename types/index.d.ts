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
  GridRowParams,
  MuiEvent,
} from '@mui/x-data-grid';

// React allgemein

// abgewandelt (teilweise gleich) hier exportieren, um nur diese Datei für types zu importieren

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

// MUI

// DataGrid

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
