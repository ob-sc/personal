import { useForm } from 'react-hook-form';
import { Box, Grid } from '@mui/material';
import Input from '../components/common/Input';
import theme from '../theme';
import SubmitButton from '../components/common/SubmitButton';
import { LoginInputs } from '../types/forms';
import useRequest from '../hooks/useRequest';

const isSubmitting = false;
const isSuccess = false;

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputs>();

  const { mutate } = useRequest({ url: '/api/session/login', method: 'POST' });

  const onSubmit = (values: LoginInputs) => {
    try {
      mutate(values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            p: 1.5,
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
              <SubmitButton text="Anmelden" loading={isSubmitting} success={isSuccess} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  );
};

export default Login;
