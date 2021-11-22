import { Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// größe ist angepasst an size="small" inputs

interface Props {
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
}

function SubmitButton({ loading, success, disabled }: Props) {
  return (
    <Button
      type="submit"
      color="primary"
      disabled={loading || success || disabled}
      style={{ width: 100, height: 40 }}
    >
      {loading ? (
        <CircularProgress size="1.5rem" thickness={2.5} />
      ) : success ? (
        <CheckIcon />
      ) : (
        'Absenden'
      )}
    </Button>
  );
}

export default SubmitButton;
