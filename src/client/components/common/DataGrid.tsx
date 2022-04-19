import { useState } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  GridColDef,
  GridRowsProp,
  DataGrid as MuiDataGrid,
  deDE,
} from '@mui/x-data-grid';
import {
  CellClickHandler,
  GridCol,
  MouseEventHandler,
  ReactNode,
  RowClickHandler,
} from '../../../../types';
import { searchFilter } from '../../../utils/client';
import DataGridFooter from './DataGridFooter';
import useMobileContext from '../../context/MobileContext';

interface Props {
  columns: GridCol[];
  rows: GridRowsProp;
  error: boolean;
  loading: boolean;
  rowClickHandler?: RowClickHandler;
  cellClickHandler?: CellClickHandler;
  add?: boolean;
  actionHandler?: MouseEventHandler;
  actionIcon?: ReactNode;
}

const DataGrid = ({
  columns,
  rows,
  error,
  loading,
  rowClickHandler,
  cellClickHandler,
  add,
  actionHandler,
  actionIcon,
}: Props) => {
  const mobile = useMobileContext();
  const [search, setSearch] = useState('');

  // MUI bug: bei error === false trotzdem error state, undefined nicht
  const err = error ? true : undefined;

  const filteredRows = searchFilter(search, rows);

  const cols: GridColDef[] = [];

  if (mobile.sm) {
    for (const obj of columns) {
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'sm' && v === true) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { sm, ...filtered } = obj;
          cols.push({ ...filtered });
        }
      }
    }
  }

  return (
    <Box
      sx={{
        height: 650,
        width: '100%',
        '& .MuiDataGrid-row:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <MuiDataGrid
        rows={filteredRows}
        columns={mobile.sm ? cols : columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        loading={loading}
        error={err}
        onCellClick={cellClickHandler}
        onRowClick={rowClickHandler}
        hideFooterSelectedRowCount
        disableSelectionOnClick
        disableColumnSelector
        components={{
          Footer: DataGridFooter,
        }}
        componentsProps={{
          footer: {
            mobile,
            search,
            setSearch,
            actionHandler,
            actionIcon: add ? <AddIcon /> : actionIcon,
          },
        }}
      />
    </Box>
  );
};

export default DataGrid;
