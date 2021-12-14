import { useState } from 'react';
import { Box, IconButton, Pagination, TextField } from '@mui/material';
import {
  GridColDef,
  GridRowsProp,
  DataGrid as MuiDataGrid,
  useGridApiContext,
  useGridState,
} from '@mui/x-data-grid';
import { CellClickHandler, MouseEventHandler, ReactNode, RowClickHandler } from '../../../../types';
import dataGridLocale from '../../util/dataGridLocale';
import searchFilter from '../../util/searchFilter';

interface Props {
  columns: GridColDef[];
  rows: GridRowsProp;
  error: boolean;
  loading: boolean;
  rowClickHandler?: RowClickHandler;
  cellClickHandler?: CellClickHandler;
  actionHandler: MouseEventHandler;
  actionIcon: ReactNode;
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      size="large"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
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

  // mui bug: bei error === false trotzdem error state, undefined nicht
  const err = error ? true : undefined;

  const filteredRows = searchFilter(search, rows);

  return (
    <Box sx={{ height: 650, width: '100%' }}>
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
          // Footer kann kein component sein, brauche hier state und props
          // todo nach einem tastendruck im search input verliert er focus, aber kein onblur? eigener komponent, dann einfach bdrüber und footer disablen?
          Footer: () => (
            <Box sx={{ display: 'flex', mb: 2, mx: 2 }}>
              <TextField
                placeholder="Suche"
                size="small"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              {actionHandler !== undefined ? (
                <IconButton sx={{ ml: 2 }} onClick={actionHandler}>
                  {actionIcon}
                </IconButton>
              ) : null}
              <Box sx={{ flexGrow: 1 }} />
              <CustomPagination />
            </Box>
          ),
        }}
      />
    </Box>
  );
};

export default DataGrid;
