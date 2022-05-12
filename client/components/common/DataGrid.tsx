import { useState } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridRowsProp, DataGrid as MuiDataGrid, deDE } from '@mui/x-data-grid';
import {
  CellClickHandler,
  DataGridCol,
  MouseEventHandler,
  ReactNode,
  RowClickHandler,
} from 'types/client';
import { searchFilter } from 'utils/client';
import useMobileContext from 'client/context/MobileContext';
import DataGridFooter from 'client/components/common/DataGridFooter';

interface Props {
  columns: DataGridCol[];
  rows: GridRowsProp;
  error: boolean;
  loading: boolean;
  rowClickHandler?: RowClickHandler;
  cellClickHandler?: CellClickHandler;
  add?: boolean;
  actionHandler?: MouseEventHandler;
  actionIcon?: ReactNode;
}

function DataGrid({
  columns,
  rows,
  error,
  loading,
  rowClickHandler,
  cellClickHandler,
  add,
  actionHandler,
  actionIcon,
}: Props) {
  const mobile = useMobileContext();
  const [search, setSearch] = useState('');

  // bug: bei error === false trotzdem error state, undefined nicht
  const err = error ? true : undefined;

  // "suchen" input
  const filteredRows = searchFilter(search, rows);

  // todo zuviele nested loops? hier optimieren?
  // mit moobile sm werden nur spalten mit `sm: true` angezeigt
  const cols: DataGridCol[] = [];
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
}

export default DataGrid;
