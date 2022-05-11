import { Chip } from '@mui/material';

interface Props {
  label: string;
  deleteId: number;
}

// todo großen ACHTUNG MÖCHTEST DU WIRKLICH LÖSCHEN, Alle statoinen mit region verlieren region

function RegionChip({
  label,
  //  handleClick,
  deleteId,
}: Props) {
  return (
    <Chip
      label={label}
      variant="outlined"
      // onClick={handleClick}
      onDelete={() => {
        console.log('deleteId', deleteId);
      }}
      sx={{
        minWidth: 100,
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    />
  );
}

export default RegionChip;
