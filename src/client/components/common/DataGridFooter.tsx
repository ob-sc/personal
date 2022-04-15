import { Dispatch, SetStateAction, useState } from 'react';
import { Box, IconButton, Pagination, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import { useGridApiContext } from '@mui/x-data-grid';
import { MouseEventHandler, ReactNode } from '../../../../types';
import { Mobile } from '../../hooks/useMobileScreen';

interface Props {
  mobile: Mobile;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  actionHandler?: MouseEventHandler;
  actionIcon?: ReactNode;
}

const DataGridFooter = ({
  mobile,
  search,
  setSearch,
  actionHandler,
  actionIcon,
}: Props) => {
  const [searching, setSearching] = useState(false);
  const apiRef = useGridApiContext();
  const { state } = apiRef.current;

  const { sm, md } = mobile;

  return (
    <Box
      sx={{ display: 'flex', flexFlow: 'row nowrap', m: 1, gap: sm ? 0 : 1 }}
    >
      {!searching && actionHandler && actionIcon ? (
        <IconButton onClick={actionHandler}>{actionIcon}</IconButton>
      ) : null}

      {sm && !searching ? null : (
        <TextField
          placeholder="Suche"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          autoFocus={sm}
          sx={{ width: searching ? '100%' : 300 }}
        />
      )}

      {!sm ? null : (
        <IconButton onClick={() => setSearching(!searching)}>
          {searching ? <CheckIcon /> : <SearchIcon />}
        </IconButton>
      )}

      <Box sx={{ flexGrow: 1 }} />

      {searching ? null : (
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          size="large"
          boundaryCount={0}
          siblingCount={md ? 0 : 2}
          showFirstButton={md ? false : true}
          showLastButton={md ? false : true}
          count={state.pagination.pageCount}
          page={state.pagination.page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
      )}
    </Box>
  );
};

export default DataGridFooter;
