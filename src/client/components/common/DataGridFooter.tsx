import { Dispatch, SetStateAction } from 'react';
import { Box, IconButton, Pagination, TextField } from '@mui/material';
import { useGridApiContext, useGridState } from '@mui/x-data-grid';
import { MouseEventHandler, ReactNode } from '../../../../types';

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  actionHandler?: MouseEventHandler;
  actionIcon?: ReactNode;
}

const DataGridFooter = ({
  search,
  setSearch,
  actionHandler,
  actionIcon,
}: Props) => {
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

  return (
    <Box sx={{ display: 'flex', mb: 2, mx: 2 }}>
      <TextField
        placeholder="Suche"
        size="small"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      {actionHandler && actionIcon ? (
        <IconButton sx={{ ml: 2 }} onClick={actionHandler}>
          {actionIcon}
        </IconButton>
      ) : null}

      <Box sx={{ flexGrow: 1 }} />

      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        size="large"
        boundaryCount={0}
        siblingCount={2}
        showFirstButton
        showLastButton
        count={state.pagination.pageCount}
        page={state.pagination.page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    </Box>
  );
};

export default DataGridFooter;
