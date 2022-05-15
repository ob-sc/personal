import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GridRowsProp, DataGrid as MuiDataGrid, deDE } from '@mui/x-data-grid';
import {
  CellClickHandler,
  DataGridCol,
  MouseEventHandler,
  ReactNode,
  RowClickHandler,
} from 'src/common/types/client';
import { searchFilter } from 'src/common/utils/client';
import useMobileContext from 'src/common/context/MobileContext';
import DataGridFooter from 'src/common/components/DataGridFooter';

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

const style = {
  height: 650,
  width: '100%',
  '& .MuiDataGrid-row:hover': {
    cursor: 'pointer',
  },
};

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
  const [filteredRows, setFilteredRows] = useState(rows);

  // bug: bei error === false trotzdem error state, undefined nicht
  const err = error ? true : undefined;

  // mit mobile sm werden nur spalten mit `sm: true` angezeigt (definiert in tables/[table].tsx)
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

  useEffect(() => {
    // bei Eingabe in "suchen" input
    setFilteredRows(searchFilter(search, rows));
  }, [rows, search]);

  return (
    <Box sx={style}>
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
