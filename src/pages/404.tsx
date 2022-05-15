import { Box, Typography } from '@mui/material';
import Layout from 'src/common/components/Layout';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function Custom404() {
  return (
    <Layout>
      <Box sx={style}>
        <Typography variant="h2">Seite nicht gefunden</Typography>
      </Box>
    </Layout>
  );
}

export default Custom404;
