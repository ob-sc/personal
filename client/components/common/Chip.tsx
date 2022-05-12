import { Chip as MuiChip } from '@mui/material';

interface Props {
  label: string;
  onClick?: () => void;
  onDelete?: () => void;
}

function Chip({ label, onClick, onDelete }: Props) {
  return (
    <MuiChip
      label={label}
      variant="outlined"
      onClick={onClick}
      onDelete={onDelete}
      sx={{
        margin: 0.5,
        minWidth: 100,
      }}
    />
  );
}

export default Chip;
