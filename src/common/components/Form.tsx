import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Box, Typography } from '@mui/material';
import { errorText } from 'src/config/constants';
import { CProps, ColWidth, FormField } from 'src/common/types/client';
import { ErrorResponse } from 'src/common/types/server';
import useMobileContext from 'src/common/context/MobileContext';
import Select from 'src/common/components/Select';
import MultiSelect from 'src/common/components/MultiSelect';
import Input from 'src/common/components/Input';
import Button from 'src/common/components/Button';

interface Props extends CProps {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  submitName?: string;
  size?: ColWidth;
  cols?: number;
  disableHeader?: boolean;
  fullWidth?: boolean;
  values?: unknown;
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
    flexFlow: 'column nowrap',
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

  const submitHandler = (val: FormEntity) => {
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
    const { type, name, label, required, options } = field;

    const param = {
      name,
      label,
      control,
      errors,
      required,
      key: name,
      cn: 'gridItem',
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
      <Select {...param} options={options ?? []} />
    ) : type === 'multiselect' ? (
      <MultiSelect {...param} options={options ?? []} />
    ) : (
      <Input {...param} type={type} />
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Box sx={containerStyle}>
        <Box sx={gridStyle}>
          {fields.map(fieldMap)}
          {error?.response?.data?.message ? (
            <Typography color="error">
              {error.response.data.message ?? errorText}
            </Typography>
          ) : null}
        </Box>

        <Button text={submitName ?? 'OK'} loading={submitting} submit={true} />
      </Box>
    </form>
  );
}

export default Form;
