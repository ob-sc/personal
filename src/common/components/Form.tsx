import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Box, Typography } from '@mui/material';
import { errorText } from 'src/config/constants';
import { CProps, ColWidth, FormField } from 'src/common/types/client';
import { ErrorResponse } from 'src/common/types/server';
import useMobileContext from 'src/common/context/MobileContext';
import FormSelect from 'src/common/components/FormSelect';
import FormMultiSelect from 'src/common/components/FormMultiSelect';
import FormInput from 'src/common/components/FormInput';
import Button from 'src/common/components/Button';

export type FormValues = { [key: string]: string };

interface Props extends CProps {
  fields: FormField[];
  onSubmit: (values: FormValues) => Promise<void>;
  submitName?: string;
  size?: ColWidth;
  cols?: number;
  disableHeader?: boolean;
  fullWidth?: boolean;
  values?: FormValues;
  disabled?: string[];
  inline?: boolean;
}

function Form({
  onSubmit,
  fields,
  submitName,
  size = 'md',
  cols = 1,
  disableHeader,
  fullWidth,
  values,
  disabled,
  inline,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError,
    setValue,
  } = useForm();

  const { sm, md, mobile } = useMobileContext();

  const width = {
    xs: 160,
    sm: 280,
    md: 340,
    lg: 400,
    xl: 460,
  };

  // mit fullWidth prop oder mobile 100%, sonst anzahl der colums * breite des inputs (xs-xl)
  const containerWidth = mobile || fullWidth ? '100%' : width[size] * cols;

  const containerStyle = {
    width: containerWidth,
    display: 'flex',
    gap: 2,
    flexFlow: inline ? 'row nowrap' : 'column nowrap',
    // mb: 2,
  };

  // spaltenanzahl bei responsive variablen: sm = 1, md = 2, nicht responsive auch mehrere
  // breite ist dabei immer `full`, also bei sm und bei md
  const columns = sm ? 1 : md && cols > 1 ? 2 : cols;

  const gridStyle = {
    width: '100%',
    display: 'grid',
    gridGap: 10,
    // vor und nach header neue zeile
    '& .gridItem + .gridHeader': { gridColumnStart: 1 },
    '& .gridHeader + .gridItem': { gridColumnStart: 1 },
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const errorMessageStyle = { mt: 2, width: containerWidth };

  useEffect(() => {
    const e = error?.response?.data;
    if (e?.fields) {
      for (const f of e.fields) {
        setFormError(f, {
          message: e.message,
        });
      }
    }

    // wenn werte mitgegeben werden, dann (für zb einen PUT request) die values in die form schreiben
    if (values) {
      for (const [key, value] of Object.entries(values)) {
        setValue(key, value);
      }
    }
  }, [error?.response, setFormError, setValue, values]);

  const submitHandler = (val: FormValues) => {
    setSubmitting(true);
    onSubmit(val)
      .catch((err) => {
        setError(err as AxiosError<ErrorResponse>);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const fieldMap = (field: FormField) => {
    const { type, name, label, required, selOptions } = field;

    const param = {
      name,
      label,
      control,
      errors,
      required,
      key: name,
      cn: 'gridItem',
      disabled: disabled?.includes(name),
    };

    return type === 'header' && disableHeader ? null : type === 'header' ? (
      <Box
        className="gridHeader"
        sx={{ width: '100%', minHeight: 10 }}
        key={name}
      >
        <Typography variant="h5">{label}</Typography>
      </Box>
    ) : type === 'select' ? (
      <FormSelect {...param} options={selOptions ?? []} />
    ) : type === 'multiselect' ? (
      <FormMultiSelect {...param} options={selOptions ?? []} />
    ) : (
      <FormInput {...param} type={type} />
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Box sx={containerStyle}>
        <Box sx={gridStyle}>{fields.map(fieldMap)}</Box>
        <Button text={submitName ?? 'OK'} loading={submitting} submit={true} />
      </Box>

      {error?.response?.data?.message ? (
        <Box sx={errorMessageStyle}>
          <Typography color="error">
            {error.response.data.message ?? errorText}
          </Typography>
        </Box>
      ) : null}
    </form>
  );
}

export default Form;
