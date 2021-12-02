import {
  ChangeEventHandler as CEH,
  FormEventHandler as FEH,
  MouseEventHandler as MEH,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import { GridCallbackDetails, GridCellParams, GridRowParams, MuiEvent } from '@mui/x-data-grid';

// React Events

export type ChangeEventHandler = CEH<HTMLTextAreaElement | HTMLInputElement>;
export type FormEventHandler = FEH<HTMLFormElement>;
export type MouseEventHandler = MEH<
  HTMLButtonElement | HTMLAnchorElement | HTMLInputElement,
  HTMLImageElement
>;

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

// React ChildrenProps

export interface CProps {
  children?: ReactNode;
}
