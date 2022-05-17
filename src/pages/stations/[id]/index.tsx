import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { withSessionSsr } from 'src/common/middleware/withSession';
import { putStation, useGetStation } from 'src/modules/stations/api';
import Layout from 'src/common/components/Layout';
import DataList from 'src/common/components/DataList';
import { stationDescriptions as statDesc } from 'src/modules/stations/columns';
import { KeyValue } from 'src/common/types/client';
import { commaJoin, formSafeEntity } from 'src/common/utils/shared';
import Button from 'src/common/components/Button';
import { useState } from 'react';
import Modal from 'src/common/components/Modal';
import Form from 'src/common/components/Form';
import { stationFields } from 'src/modules/stations/columns';
import { selectOptionMapper } from 'src/common/utils/client';
import { useGetRegions } from 'src/modules/regions/api';
import { idFromQuery } from 'src/common/utils/server';

export const getServerSideProps = withSessionSsr();

function SingleStationPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();
  const id = idFromQuery(router.query.id ?? '');

  const { data, isValidating, mutate } = useGetStation(id);
  const [modalOpen, setModalOpen] = useState(false);

  const hasAccess = user.access.stations.read;

  const usersString = commaJoin(
    data?.users.map(
      (v) => `${v.first_name && v.first_name[0]}. ${v.last_name}`
    ) ?? []
  );

  const displayData: KeyValue[] = [
    { key: statDesc.id, value: String(data?.id) },
    { key: statDesc.name, value: data?.name },
    { key: statDesc.address, value: data?.address },
    { key: statDesc.zip, value: data?.zip },
    { key: statDesc.city, value: data?.city },
    { key: statDesc.telephone, value: data?.telephone },
    { key: statDesc.fax, value: data?.fax },
    { key: statDesc.email, value: data?.email },
    { key: statDesc.region, value: data?.region.name },
    {
      key: statDesc.subregion,
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
            await putStation(id, values);
            await mutate();
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
