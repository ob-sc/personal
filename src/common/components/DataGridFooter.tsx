import { Dispatch, SetStateAction, useState } from 'react';
import {
  Box,
  IconButton,
  Pagination,
  PaginationItem,
  TextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useGridApiContext } from '@mui/x-data-grid';
import { MouseEventHandler, ReactNode } from 'src/common/types/client';
import { Mobile } from 'src/common/hooks/useMobileScreen';

interface Props {
  mobile: Mobile;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  actionHandler?: MouseEventHandler;
  actionIcon?: ReactNode;
}

const style = { display: 'flex', flexFlow: 'row nowrap', m: 1 };

function DataGridFooter({
  mobile,
  search,
  setSearch,
  actionHandler,
  actionIcon,
}: Props) {
  const [searching, setSearching] = useState(false);
  const apiRef = useGridApiContext();
  const { state } = apiRef.current;

  const { sm, mobile: responsive } = mobile;

  return (
    <Box sx={{ ...style, gap: sm ? 0 : 1 }}>
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
        <IconButton
          onClick={() => {
            if (!searching && search !== '') setSearch('');
            else setSearching(!searching);
          }}
        >
          {searching ? (
            <CheckIcon />
          ) : search ? (
            <SearchOffIcon />
          ) : (
            <SearchIcon />
          )}
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
          // mobile nicht genug Platz, dann nur previous und next
          renderItem={(item) =>
            responsive &&
            item.type !== 'previous' &&
            item.type !== 'next' ? null : (
              <PaginationItem {...item} />
            )
          }
          siblingCount={2}
          count={state.pagination.pageCount}
          page={state.pagination.page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
      )}
    </Box>
  );
}

export default DataGridFooter;
