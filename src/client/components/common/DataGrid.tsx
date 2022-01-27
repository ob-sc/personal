import { useState } from 'react';
import { Box } from '@mui/material';
import { GridColDef, GridRowsProp, DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { CellClickHandler, MouseEventHandler, ReactNode, RowClickHandler } from '../../../../types';
import dataGridLocale from '../../util/dataGridLocale';
import searchFilter from '../../util/searchFilter';
import DataGridFooter from './DataGridFooter';

interface Props {
  columns: GridColDef[];
  rows: GridRowsProp;
  error: boolean;
  loading: boolean;
  rowClickHandler?: RowClickHandler;
  cellClickHandler?: CellClickHandler;
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
  actionHandler,
  actionIcon,
}: Props) => {
  const [search, setSearch] = useState('');

  // MUI bug: bei error === false trotzdem error state, undefined nicht
  const err = error ? true : undefined;

  const filteredRows = searchFilter(search, rows);

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
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        localeText={dataGridLocale}
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
          footer: { search, setSearch, actionHandler, actionIcon },
        }}
      />
    </Box>
  );
};

export default DataGrid;
