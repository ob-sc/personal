import { GridColDef, GridRowsProp, DataGrid as MuiDatagrid } from '@mui/x-data-grid';
import dataGridLocale from '../../util/dataGridLocale';

interface Props {
  columns: GridColDef[];
  rows: GridRowsProp;
  error: boolean;
  loading: boolean;
}

const DataGrid = ({ columns, rows, error, loading }: Props) => {
  const err = error ? true : undefined;
  console.log(err);

  return (
    <div>
      <MuiDatagrid
        rows={rows}
        columns={columns}
        localeText={dataGridLocale}
        hideFooterSelectedRowCount
        disableSelectionOnClick
        disableColumnSelector
        loading={loading}
        error={err}
        onCellClick={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
};

export default DataGrid;
