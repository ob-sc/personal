import { TextField } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  // kann Control nicht genauer definieren ohne alle Objekte wie LoginInputs zu übergeben
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  errors: FieldErrors;
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
          autoComplete={
            name === 'password'
              ? 'current-password'
              : name === 'username'
              ? 'username'
              : undefined
          }
          {...field}
        />
      )}
    />
  );
};

export default Input;
