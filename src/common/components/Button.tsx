import {
  ButtonProps,
  CircularProgress,
  Button as MuiButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { CProps, MouseEventHandler } from 'src/common/types/client';

// größe ist angepasst an size="small" inputs

interface Props extends CProps {
  text?: string;
  loading?: boolean;
  success?: boolean;
  disabled?: ButtonProps['disabled'];
  submit?: boolean;
  onClick?: MouseEventHandler;
  color?: ButtonProps['color'];
  formId?: string;
}

function Button({
  text = 'OK',
  loading,
  success,
  disabled,
  submit,
  onClick,
  children,
  color = 'primary',
  formId = crypto.randomUUID(),
}: Props) {
  return (
    <MuiButton
      type={submit ? 'submit' : 'button'}
      color={color}
      disabled={loading || success || disabled}
      style={{ width: 150 }}
      // , height: 40
      onClick={onClick}
      form={formId ? formId : undefined}
    >
      {loading ? (
        <CircularProgress size="1.5rem" thickness={2.5} />
      ) : success ? (
        <CheckIcon />
      ) : (
        children || text
      )}
    </MuiButton>
  );
}

export default Button;
