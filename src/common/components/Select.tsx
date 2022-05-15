import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import CenteredSpinner from 'src/common/components/CenteredSpinner';
import { SelectOption } from 'src/common/types/client';

interface Props {
  name: string;
  label: string;
  options: SelectOption[];
  control: Control;
  errors: FieldErrors;
  required?: boolean;
  cn?: string;
  loading?: boolean;
}

function Select({
  name,
  label,
  options,
  required,
  control,
  errors,
  cn,
  loading,
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
            {loading ? (
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
