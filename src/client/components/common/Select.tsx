import { FormControl, Select as MuiSelect, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  options: SelectOption[];
  control: Control;
  errors: FieldErrors;
  required?: boolean;
}

const Select = ({name,
  label,
  options,
  required,
  control,
  errors,}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ required }}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <MuiSelect
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  );
};

export default Select;
