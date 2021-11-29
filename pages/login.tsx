import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Box, Grid } from '@mui/material';
import Input from '../components/common/Input';
import theme from '../config/theme';
import SubmitButton from '../components/common/SubmitButton';
import log from '../lib/log';

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

  const onSubmit = async (values: LoginInputs) => {
    setSubmitting(true);
    try {
      await axios.post('/api/session/login', values);
    } catch (e) {
      setSubmitting(false);
      log.error(e);
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
            <Grid item xs={12}>
              <Input name="username" label="Benutzer" control={control} errors={errors} required />
            </Grid>
            {/* Grid container spacing macht padding links */}
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
