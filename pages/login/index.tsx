import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import theme from '../../config/theme';
import Input from '../../src/client/components/common/Input';
import SubmitButton from '../../src/client/components/common/SubmitButton';
import { postSession } from '../../src/client/api/sessions';

interface LoginInputs {
  username: string;
  password: string;
}

const fullScreenCenter = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const LoginPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginInputs>();
  const router = useRouter();

  const { redirect } = router.query;

  const [expired, setExpired] = useState('');

  useEffect(() => {
    // session bleibt im backend, localstorage nur um zu zeigen, dass es eine gab und diese expired ist
    if (window) setExpired(window.sessionStorage.getItem('session') ?? '');

    if (error?.response?.data.message) {
      const formError = error.response.data.message;

      if (formError === 'Benutzer nicht gefunden') {
        setFormError('username', {
          message: formError,
        });
      }

      if (formError === 'Passwort falsch') {
        setFormError('password', {
          message: formError,
        });
      }
    }
  }, [error?.response?.data.message, setFormError]);

  const onSubmit = async (values: LoginInputs) => {
    setSubmitting(true);
    try {
      await postSession(values);
      // um zu sehen ob user schon eingeloggt war, dann kommt bei 403 "session abgelaufen"
      window.sessionStorage.setItem('session', 'true');

      router.push(typeof redirect === 'string' ? redirect : '/');
      // window.location.href = typeof redirect === 'string' ? redirect : '/';
    } catch (err) {
      setSubmitting(false);
      setError(err as AxiosError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={fullScreenCenter}>
        <Box
          sx={{
            width: 300,
            mx: 'auto',
            p: 1.5,
            border: 1,
            borderColor: theme.palette.secondary.light,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Input
                name="username"
                label="Benutzer"
                control={control}
                errors={errors}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                name="password"
                type="password"
                label="Passwort"
                control={control}
                errors={errors}
                required
              />
            </Grid>
            <Grid item>
              <SubmitButton text="Anmelden" loading={submitting} />
            </Grid>

            {error?.response ? (
              <Grid item xs={12}>
                <Typography color="error">
                  {error.response.data.message ?? 'Unbekannter Fehler'}
                </Typography>
              </Grid>
            ) : null}

            {!error?.response && expired === 'true' ? (
              <Grid item xs={12}>
                <Typography color="error">Session ist abgelaufen</Typography>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Box>
    </form>
  );
};

export default LoginPage;
