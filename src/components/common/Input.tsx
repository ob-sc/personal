import { TextField } from '@mui/material';
import { Control, Controller, FieldError } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  control: Control<any>;
  errors: Record<string, FieldError | undefined>;
  type?: 'text' | 'number' | 'password';
  disabled?: boolean;
  errorHelper?: boolean;
  required?: boolean;
}

const Input = (props: Props) => {
  const {
    name,
    label,
    control,
    errors,
    type = 'text',
    disabled = false,
    errorHelper = false,
    required = false,
  } = props;

  const err = errors[name];
  const errorText = errorHelper === true ? err : undefined;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ required: !!required }}
      render={({ field }) => (
        <TextField
          variant="outlined"
          color="primary"
          size="small"
          type={type}
          label={label}
          fullWidth={true}
          error={!!err}
          disabled={disabled}
          helperText={errorText}
          {...field}
          // autoComplete={autoComplete}
        />
      )}
    />
  );
};

export default Input;
