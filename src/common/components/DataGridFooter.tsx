import { Dispatch, SetStateAction, useState } from 'react';
import {
  Box,
  IconButton,
  Pagination,
  PaginationItem,
  TextField,
  Tooltip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HeightIcon from '@mui/icons-material/Height';
import { useGridApiContext } from '@mui/x-data-grid';
import { MouseEventHandler, ReactNode } from 'src/common/types/client';
import { Mobile } from 'src/common/hooks/useMobileScreen';

interface Props {
  mobile: Mobile;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  actionHandler?: MouseEventHandler;
  actionIcon?: ReactNode;
  hasActive: boolean;
  withInactive: boolean;
  setWithInactive: Dispatch<SetStateAction<boolean>>;
  tooltip?: string;
  higher: boolean;
  setHigher: Dispatch<SetStateAction<boolean>>;
}

const style = { display: 'flex', flexFlow: 'row nowrap', m: 1 };

function DataGridFooter({
  mobile,
  search,
  setSearch,
  actionHandler,
  actionIcon,
  hasActive,
  withInactive,
  setWithInactive,
  tooltip = 'Aktion ausführen',
  higher,
  setHigher,
}: Props) {
  const [searching, setSearching] = useState(false);
  const apiRef = useGridApiContext();
  const { state } = apiRef.current;

  const { sm, mobile: responsive } = mobile;

  return (
    <Box sx={{ ...style, gap: sm ? 0 : 1 }}>
      {/* Suche */}
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

      {/* Action / Add Icon (wenn DataGrid add === true hat) */}
      {!searching && actionHandler && actionIcon ? (
        <Tooltip title={tooltip}>
          <IconButton onClick={actionHandler}>{actionIcon}</IconButton>
        </Tooltip>
      ) : null}

      {/* Aktive / Inaktive */}
      {hasActive && !searching ? (
        <Tooltip
          title={!withInactive ? 'Inaktive anzeigen' : 'Inaktive ausblenden'}
        >
          <IconButton
            onClick={() => {
              setWithInactive(!withInactive);
            }}
          >
            {!withInactive ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </Tooltip>
      ) : null}

      {/* Aufklappen / Zuklappen (Höhe anpassen) */}
      {!searching && (
        <Tooltip title={higher ? 'Zuklappen' : 'Aufklappen'}>
          <IconButton
            onClick={() => {
              setHigher(!higher);
            }}
          >
            <HeightIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Responsive: Suche */}
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
            <Tooltip title="Suchen">
              <SearchIcon />
            </Tooltip>
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
          // mobile nicht genug Platz, nur previous und next
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
