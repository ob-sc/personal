import { TextField } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import useMobileContext from '../../context/MobileContext';

interface Props {
  name: string;
  label: string;
  // kann Control nicht genauer definieren ohne alle Objekte wie LoginInputs zu übergeben
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  errors: FieldErrors;
  type?: 'text' | 'number' | 'password' | 'date';
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

  const { sm } = useMobileContext();

  const err = errors[name];
  const errorText = errorHelper === true ? err : undefined;

  const isPassword = name === 'password';
  const isUsername = name === 'username';

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
          // fullWidth={true}
          error={!!err}
          disabled={disabled}
          helperText={errorText}
          autoComplete={
            isPassword
              ? 'current-password'
              : isUsername
              ? 'username'
              : undefined
          }
          sx={{
            minWidth: 160,
            width: sm ? 'min(80vw, 250px)' : 340,
          }}
          {...field}
        />
      )}
    />
  );
};

export default Input;
