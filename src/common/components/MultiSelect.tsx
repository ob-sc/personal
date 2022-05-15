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
import { SelectOption } from 'src/common/types/client';
import CenteredSpinner from 'src/common/components/CenteredSpinner';

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

// https://mui.com/components/selects/#MultipleSelectCheckmarks.tsx

/** Multiselect mit Checkboxen. `options` Prop ist ein Array mit Objekten, die optval und optlabel enthalten. */
function MultiSelect({
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
            {loading ? (
              <CenteredSpinner size={25} />
            ) : (
              options.map(({ optval, optlabel }) => (
                <MenuItem key={optval} value={optval}>
                  <Checkbox
                    color="primary"
                    checked={field.value.indexOf(optval) > -1}
                  />
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
