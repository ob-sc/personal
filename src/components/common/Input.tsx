import { TextField } from '@mui/material';
import { isEmpty } from '../../lib/util';
import { ChangeEventHandler, Controller } from '../../types';

interface Props {
  name: string;
  label: string;
  controller: Controller;
  type?: 'text' | 'number' | 'password';
  disabled?: boolean;
  errorHelper?: boolean;
  required?: boolean;
}

const Input = (props: Props) => {
  const {
    name,
    label,
    controller,
    type = 'text',
    disabled = false,
    errorHelper = false,
    required = false,
  } = props;

  const { errors, values, setError, setValue } = controller;

  const err = errors[name];
  const val = values[name];
  const errorText = errorHelper === true ? err?.message : undefined;

  const changeHandler: ChangeEventHandler = (e) => {
    const value = e.target.value.trim(); // todo pw auch trim?
    if (isEmpty(value) && required === true) {
      setValue(name);
      setError(name, new Error('Pflichtfeld'));
    } else {
      setValue(name, value);
      setError(name);
    }
  };

  return (
    <TextField
      name={name}
      variant="outlined"
      color="primary"
      size="small"
      value={val}
      onChange={changeHandler}
      type={type}
      label={label}
      fullWidth={true}
      error={!!err}
      disabled={disabled}
      helperText={errorText}
      // autoComplete={autoComplete}
    />
  );
};

export default Input;
