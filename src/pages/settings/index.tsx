import { useEffect, useState } from 'react';
import { InferGetServerSidePropsType as IPT } from 'next';
import { withSessionSsr } from 'src/common/middleware/withSession';
import Layout from 'src/common/components/Layout';
import Form, { FormValues } from 'src/common/components/Form';
import { FormField } from 'src/common/types/client';
import { getFloats } from 'src/modules/settings/api';
import { Float } from 'src/entities/Float';

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
    },
  ];

  const handleMinWageSubmit = async (values: FormValues) => {
    console.log(values);
  };

  const minWageFloat = floats.find((float) => float.name === 'min_wage');
  const min_wage = minWageFloat ? minWageFloat.value : 0;

  return (
    <Layout session={user} blockAccess={!hasAccess}>
      <Form
        fields={minWageFields}
        onSubmit={handleMinWageSubmit}
        values={{ min_wage }}
      />
    </Layout>
  );
}

export default SettingsPage;
