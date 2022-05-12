import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Box, Typography } from '@mui/material';
import { CProps, FormField } from 'types/client';
import { ErrorResponse } from 'types/server';
import useMobileContext from 'client/context/MobileContext';
import Select from 'client/components/common/Select';
import MultiSelect from 'client/components/common/MultiSelect';
import Input from 'client/components/common/Input';
import SubmitButton from 'client/components/common/SubmitButton';
import { errorText } from 'config/constants';

interface Props extends CProps {
  fields: FormField[];
  onSubmit: (values: unknown) => Promise<void>;
  submitName?: string;
  size?: 'sm' | 'md' | 'lg';
  cols?: number;
}

function Form({ onSubmit, fields, submitName, size = 'md', cols = 1 }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const { sm, md, mobile } = useMobileContext();

  const width = {
    sm: 280,
    md: 340,
    lg: 400,
  };

  // spaltenanzahl sm = 1, md = 2, sonst mehrere
  const columns = sm ? 1 : md && cols >= 2 ? 2 : cols;

  const colWidth = size &&
    !mobile &&
    !(columns > 1) && { width: width[size] ?? width.md };

  useEffect(() => {
    const e = error?.response?.data;

    if (e?.fields) {
      for (const f of e.fields) {
        setFormError(f, {
          message: e.message,
        });
      }
    }
  }, [error?.response, setFormError]);

  const submitHandler = (values: unknown) => {
    setSubmitting(true);
    onSubmit(values)
      .catch((err) => {
        setError(err as AxiosError<ErrorResponse>);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexFlow: 'column nowrap',
        }}
      >
        <Box
          sx={[
            colWidth,
            {
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridGap: 10,
              // vor und nach header neue zeile
              '& .gridItem + .gridHeader': { gridColumnStart: 1 },
              '& .gridHeader + .gridItem': { gridColumnStart: 1 },
            },
          ]}
        >
          {fields.map((field) => {
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

            return type === 'header' ? (
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
          })}

          {error?.response?.data?.message ? (
            <Typography color="error">
              {error.response.data.message ?? errorText}
            </Typography>
          ) : null}
        </Box>

        <SubmitButton text={submitName ?? 'OK'} loading={submitting} />
      </Box>
    </form>
  );
}

export default Form;
