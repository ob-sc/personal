import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Box, Typography } from '@mui/material';
import { CProps, FormField } from '../../../../types';
import SubmitButton from './SubmitButton';
import Input from './Input';

interface Props extends CProps {
  fields: FormField[];
  submit: (values: unknown) => Promise<void>;
  submitName?: string;
  direction?:
    | 'column'
    | 'column wrap'
    | 'column nowrap'
    | 'row'
    | 'row wrap'
    | 'row nowrap';
}

const Form = ({ submit, fields, submitName, direction }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError,
  } = useForm();

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

  const dir = direction ?? 'row wrap';

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
          sx={{
            display: 'flex',
            flexFlow: dir,
            gap: 1,
          }}
        >
          {fields.map((field) =>
            field.type === 'header' ? (
              <Box sx={{ width: '100%', minHeight: 10 }}>
                <Typography variant="h5">{field.label}</Typography>
              </Box>
            ) : (
              <div key={field.name}>
                <Input
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  control={control}
                  errors={errors}
                  required
                />
              </div>
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
