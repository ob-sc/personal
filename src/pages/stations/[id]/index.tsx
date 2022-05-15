import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { accessConstants } from 'src/config/constants';
import { withSessionSsr } from 'src/common/middleware/withSession';
import { useGetStation } from 'src/modules/stations/api';
import Layout from 'src/common/components/Layout';
import DataList from 'src/common/components/DataList';
import { stationDescriptions } from 'src/modules/stations/columns';
import { KeyValue } from 'src/common/types/client';
import { commaJoin, formSafeEntity } from 'src/common/utils/shared';
import Button from 'src/common/components/Button';
import { useState } from 'react';
import Modal from 'src/common/components/Modal';
import Form from 'src/common/components/Form';
import { stationFields } from 'src/modules/stations/columns';
import { selectOptionMapper } from 'src/common/utils/client';
import { useGetRegions } from 'src/modules/regions/api';

export const getServerSideProps = withSessionSsr();

function SingleStationPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetStation(Number(id));
  const [modalOpen, setModalOpen] = useState(false);

  const { permitted } = accessConstants(user.access);
  const hasAccess = permitted['/users'];

  const usersString = commaJoin(
    data?.users.map(
      (v) => `${v.first_name && v.first_name[0]}. ${v.last_name}`
    ) ?? []
  );

  const displayData: KeyValue[] = [
    { key: stationDescriptions.id, value: String(data?.id) },
    { key: stationDescriptions.name, value: data?.name },
    { key: stationDescriptions.address, value: data?.address },
    { key: stationDescriptions.zip, value: data?.zip },
    { key: stationDescriptions.city, value: data?.city },
    { key: stationDescriptions.telephone, value: data?.telephone },
    { key: stationDescriptions.fax, value: data?.fax },
    { key: stationDescriptions.email, value: data?.email },
    { key: stationDescriptions.region, value: data?.region.name },
    {
      key: stationDescriptions.subregion,
      value: data?.subregion ? data.subregion.name : null,
    },
    {
      key: 'Benutzer',
      value: usersString,
    },
  ];

  const editClickHandler = () => {
    setModalOpen(true);
  };

  const regions = useGetRegions();
  const options = regions.data?.map(selectOptionMapper) ?? [];
  const modalFields = stationFields(options);

  return (
    <Layout loading={isValidating} session={user} blockAccess={!hasAccess}>
      <Typography variant="h2" gutterBottom>
        {data?.name}
      </Typography>
      <DataList data={displayData} />
      <Box sx={{ mb: 2 }} />
      <Button onClick={editClickHandler}>Bearbeiten</Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Form
          fields={modalFields}
          onSubmit={async (values) => {
            // await postRegion(values);
            // await regions.mutate();
            console.log(values);
            setModalOpen(false);
          }}
          cols={2}
          values={formSafeEntity(data)}
        />
      </Modal>
    </Layout>
  );
}

export default SingleStationPage;

// todo button deaktivieren (neues feld active) und button löschen (komplett weg)
