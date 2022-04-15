import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { postSession } from '../../src/client/api/sessions';

import { IconButton } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { isDev } from '../../src/lib/util';
import { postInit } from '../../src/client/api/init';
import Form from '../../src/client/components/common/Form';
import { FormField } from '../../types';
import theme from '../../config/theme';

const fields: FormField[] = [
  { name: 'username', label: 'Benutzer', type: 'text' },
  { name: 'password', label: 'Passwort', type: 'password' },
];

const LoginPage = () => {
  const router = useRouter();

  const { redirect } = router.query;

  const [expired, setExpired] = useState('');

  useEffect(() => {
    // session bleibt im backend, localstorage nur um zu zeigen, dass es eine gab und diese expired ist
    if (window) setExpired(window.sessionStorage.getItem('session') ?? '');
  }, []);

  const handleSubmit = async (values: unknown) => {
    await postSession(values);
    // wenn ok: speichern um zu sehen ob user schon eingeloggt war
    // dann kommt bei 403 "session abgelaufen"
    window.sessionStorage.setItem('session', 'true');

    router.push(typeof redirect === 'string' ? redirect : '/');
    // window.location.href = typeof redirect === 'string' ? redirect : '/';
  };

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {expired === 'true' ? (
          <Box>
            <Typography color="error">Die Sitzung ist abgelaufen</Typography>
          </Box>
        ) : null}

        <Box
          sx={{
            p: 1.5,
            border: 1,
            borderColor: theme.palette.secondary.light,
            borderRadius: 2,
          }}
        >
          <Form submit={handleSubmit} fields={fields} direction="column" />
        </Box>
      </Box>
      {
        // zum initialisieren von sequelize, wenn nicht prod
        !isDev ? null : (
          <IconButton
            size="large"
            color="inherit"
            onClick={postInit}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <SyncIcon />
          </IconButton>
        )
      }
    </>
  );
};

export default LoginPage;
