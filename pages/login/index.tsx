import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import theme from '../../config/theme';
import { trueString } from '../../src/lib/util';
import Input from '../../src/client/components/common/Input';
import SubmitButton from '../../src/client/components/common/SubmitButton';

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

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputs>();
  const router = useRouter();
  const { expired } = router.query;

  const onSubmit = async (values: LoginInputs) => {
    setSubmitting(true);
    try {
      await axios.post('/api/session/login', values);
    } catch (err) {
      setSubmitting(false);
    }
    router.push('/');
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
          <Grid container>
            {trueString(expired) ? (
              <Grid item xs={12} sx={{ mb: 1 }}>
                <Typography color="error">Session ist abgelaufen</Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Input name="username" label="Benutzer" control={control} errors={errors} required />
            </Grid>
            <Grid item xs={12} sx={{ my: 1 }}>
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
          </Grid>
        </Box>
      </Box>
    </form>
  );
};

export default Login;
