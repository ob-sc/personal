import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Box, Typography } from '@mui/material';
import { CProps, FormField } from '../../../../types/client';
import SubmitButton from './SubmitButton';
import Input from './Input';
import useMobileContext from '../../context/MobileContext';

interface Props extends CProps {
  fields: FormField[];
  submit: (values: unknown) => Promise<void>;
  submitName?: string;
  size?: 'sm' | 'md' | 'lg';
  cols?: number;
}

const Form = ({ submit, fields, submitName, size = 'md', cols = 1 }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
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

  const columns = sm ? 1 : md && cols >= 2 ? 2 : cols;

  const colWidth = size &&
    !mobile &&
    !(columns > 1) && { width: width[size] ?? width.md };

  useEffect(() => {
    const errData = error?.response?.data ?? {};

    if (errData.field) {
      setFormError(errData.field, {
        message: errData.message,
      });
    }
  }, [error?.response?.data, setFormError]);

  const onSubmit = (values: unknown) => {
    setSubmitting(true);
    submit(values)
      .catch((err) => {
        setError(err as AxiosError);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          {fields.map((field) =>
            field.type === 'header' ? (
              <Box
                className="gridHeader"
                sx={{ width: '100%', minHeight: 10 }}
                key={field.name}
              >
                <Typography variant="h5">{field.label}</Typography>
              </Box>
            ) : (
              <Input
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                control={control}
                errors={errors}
                required={field.required ?? false}
                grid
              />
            )
          )}
        </Box>

        <SubmitButton text={submitName ?? 'OK'} loading={submitting} />

        {error?.response ? (
          <Typography color="error">
            {error.response.data.message ?? 'Unbekannter Fehler'}
          </Typography>
        ) : null}
      </Box>
    </form>
  );
};

export default Form;
