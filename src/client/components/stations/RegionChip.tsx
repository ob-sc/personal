import { Chip } from '@mui/material';

interface Props {
  label: string;
  handleClick: () => void;
  handleDelete: () => void;
}

function RegionChip({ label, handleClick, handleDelete }: Props) {
  return (
    <Chip
      label={label}
      variant="outlined"
      onClick={handleClick}
      onDelete={handleDelete}
    />
  );
}

export default RegionChip;
