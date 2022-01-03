import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { SelectOption } from '../../../../types';
import CenteredSpinner from './CenteredSpinner';

interface Props {
  name: string;
  label: string;
  options: SelectOption[];
  control: Control;
  errors: FieldErrors;
  required?: boolean;
}

// todo https://mui.com/components/selects/#MultipleSelectCheckmarks.tsx

function MultiSelect({ name, label, options, required, control, errors }: Props) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ required }}
      render={({ field }) => (
        <FormControl variant="outlined" error={!!errors[name]} fullWidth={true} size="small">
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            multiple
            labelId={`${name}-label`}
            id={`${name}-multiple`}
            input={<OutlinedInput label={label} />}
            // renderValue={(selected) => `${selected.length} ausgewählt`}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{ variant: 'menu' }}
            {...field}
            value={[...field.value]}
          >
            {options.length === 0 ? (
              <CenteredSpinner size={25} />
            ) : (
              options.map(({ optval, optlabel }) => (
                <MenuItem key={optval} value={optval}>
                  <Checkbox color="primary" checked={field.value.indexOf(optval) > -1} />
                  <ListItemText primary={optlabel} />
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}
    />
  );
}

export default MultiSelect;
