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
import { hasOwnProperty } from 'src/common/utils/shared';

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
  const [filteredRows, setFilteredRows] = useState(rows);
  const [withInactive, setWithInactive] = useState(false);
  const [higher, setHigher] = useState(false);

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

  const hasActive = hasOwnProperty(rows[0], 'active');

  const results = withInactive
    ? filteredRows
    : filteredRows.filter((r) => r.active === 1);

  const style = {
    height: higher ? 910 : 650,
    width: '100%',
    '& .MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
    '& .datagrid-inactive': {
      opacity: 0.5,
    },
  };

  return (
    <Box sx={style}>
      <MuiDataGrid
        rows={results}
        columns={mobile.sm ? cols : columns}
        pageSize={higher ? 15 : 10}
        // rowsPerPageOptions={[10]}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        loading={loading}
        error={err}
        onCellClick={cellClickHandler}
        onRowClick={rowClickHandler}
        getRowClassName={(params) =>
          params.row.active === 1 ? '' : 'datagrid-inactive'
        }
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
            hasActive,
            withInactive,
            setWithInactive,
            tooltip: add ? 'Neu' : undefined,
            higher,
            setHigher,
          },
        }}
      />
    </Box>
  );
}

export default DataGrid;
