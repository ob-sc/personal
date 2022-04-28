import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { SelectOption } from '../../../../types/client';
import CenteredSpinner from './CenteredSpinner';

interface Props {
  name: string;
  label: string;
  options: SelectOption[];
  control: Control;
  errors: FieldErrors;
  required?: boolean;
  cn?: string;
}

function Select({
  name,
  label,
  options,
  required,
  control,
  errors,
  cn,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ required }}
      render={({ field }) => (
        <FormControl
          className={cn}
          variant="outlined"
          error={!!errors[name]}
          fullWidth={true}
          size="small"
        >
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <MuiSelect
            labelId={`${name}-label`}
            id={name}
            label={label}
            {...field}
          >
            {options.length === 0 ? (
              <CenteredSpinner size={25} />
            ) : (
              options.map(({ optval, optlabel }) => (
                <MenuItem key={optval} value={optval}>
                  {optlabel}
                </MenuItem>
              ))
            )}
          </MuiSelect>
        </FormControl>
      )}
    />
  );
}

export default Select;