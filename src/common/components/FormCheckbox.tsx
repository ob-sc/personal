import { Checkbox, FormControlLabel } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  control: Control;
  required?: boolean;
}

function FormCheckbox({ name, label, required, control }: Props) {
  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          defaultValue={false}
          rules={{ required }}
          render={({ field }) => (
            <Checkbox
              color="primary"
              onChange={(e) => field.onChange(e.target.checked)}
              checked={field.value}
            />
          )}
        />
      }
      label={label}
    />
  );
}

export default FormCheckbox;
