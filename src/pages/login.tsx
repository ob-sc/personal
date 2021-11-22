import { FormEvent } from 'react';
import { Box, Grid } from '@mui/material';
import Input from '../components/common/Input';
import theme from '../theme';
import SubmitButton from '../components/common/SubmitButton';
import useForm from '../hooks/useForm';

const Login = () => {
  const init = { username: '', password: '' };
  const required = ['username', 'password'];
  const { submitHandler, controller, isSuccess, isSubmitting } = useForm(init, required);

  return (
    <form onSubmit={submitHandler}>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 300,
            mx: 'auto',
            p: 3,
            border: 1,
            borderColor: theme.palette.primary.light,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Input name="username" label="Benutzer" controller={controller} />
            </Grid>
            <Grid item xs={12} sx={{ my: 1 }}>
              <Input name="password" type="password" label="Passwort" controller={controller} />
            </Grid>
            <Grid item>
              <SubmitButton loading={isSubmitting} success={isSuccess} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  );
};

export default Login;
