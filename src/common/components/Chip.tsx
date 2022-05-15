import { Chip as MuiChip } from '@mui/material';

interface Props {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

const style = {
  margin: 0.5,
  minWidth: 100,
};

function Chip({ label, selected, onClick, onDelete }: Props) {
  const border = selected ? { borderColor: 'primary.main' } : null;

  return (
    <MuiChip
      label={label}
      variant="outlined"
      onClick={onClick}
      onDelete={onDelete}
      sx={[style, border]}
    />
  );
}

export default Chip;
