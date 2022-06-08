import { useEffect, useState } from 'react';
import { InferGetServerSidePropsType as IPT } from 'next';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';
import Form, { FormValues } from 'src/common/components/Form';
import { FormField } from 'src/common/types/client';
import { getFloats, putFloats } from 'src/modules/settings/api';
import { Float } from 'src/entities/Float';
import { Box, Typography } from '@mui/material';
import { border } from 'src/common/styles';
import Button from 'src/common/components/Button';
import { putLdapUsers } from 'src/modules/ldap/api';

export const getServerSideProps = withSessionSsr();

function SettingsPage({ user }: IPT<typeof getServerSideProps>) {
  const [floats, setFloats] = useState<Float[]>([]);
  const hasAccess = user.access.admin.write;

  useEffect(() => {
    getFloats().then((response) => {
      setFloats(response.data);
    });
  }, []);

  const minWageFields: FormField[] = [
    {
      name: 'min_wage',
      label: 'Mindestlohn',
      type: 'number',
      required: true,
      numOptions: {
        min: 0,
        step: 0.01,
      },
    },
  ];

  const handleMinWageSubmit = async (values: FormValues) => {
    await putFloats({ name: 'min_wage', value: values.min_wage });
  };

  const minWageFloat = floats.find((float) => float.name === 'min_wage');
  const min_wage = String(minWageFloat ? minWageFloat.value : 0);

  const cardStyle = {
    ...border,
    p: 2,
    m: 2,
    height: 250,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
  };

  return (
    <Layout session={user} blockAccess={!hasAccess} grid>
      <Box sx={cardStyle}>
        <div>
          <Typography variant="h2">Mindestlohn</Typography>
          <Typography>
            Aushilfen können nicht abgemeldet werden, wenn ihr Stundenlohn
            kleiner als dieser Wert ist.
          </Typography>
        </div>
        <Box sx={{ mb: 2 }} />
        <Form
          fields={minWageFields}
          onSubmit={handleMinWageSubmit}
          values={{ min_wage }}
          inline
        />
      </Box>

      <Box sx={cardStyle}>
        <div>
          <Typography variant="h2">Active Directory</Typography>
          <Typography>
            Active Directory importieren. Dabei werden auch die Benutzergruppen
            (Station oder Abteilung) angepasst, Berechtigungen nicht.
          </Typography>
        </div>
        <Box sx={{ mb: 2 }} />
        <Button onClick={putLdapUsers}>Import</Button>
      </Box>
    </Layout>
  );
}

export default SettingsPage;
