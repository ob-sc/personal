import { Box, Typography } from '@mui/material';
import Layout from 'client/components/layout/Layout';

function Custom404() {
  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h2">Seite nicht gefunden</Typography>
      </Box>
    </Layout>
  );
}

export default Custom404;
