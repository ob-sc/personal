import { GridColDef, GridRowsProp, DataGrid as MuiDatagrid } from '@mui/x-data-grid';
import { CellClickHandler, RowClickHandler } from '../../../../types';
import dataGridLocale from '../../util/dataGridLocale';

interface Props {
  columns: GridColDef[];
  rows: GridRowsProp;
  error: boolean;
  loading: boolean;
  rowClickHandler?: RowClickHandler;
  cellClickHandler?: CellClickHandler;
}

const DataGrid = ({ columns, rows, error, loading, rowClickHandler, cellClickHandler }: Props) => {
  const err = error ? true : undefined;

  return (
    <div style={{ height: 650, width: '100%' }}>
      <MuiDatagrid
        rows={rows}
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
      />
    </div>
  );
};

export default DataGrid;
