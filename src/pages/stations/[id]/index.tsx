import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { withSessionSsr } from 'src/common/middleware/withSession';
import {
  patchStation,
  putStation,
  useGetStation,
} from 'src/modules/stations/api';
import Layout from 'src/common/components/Layout';
import DataList from 'src/common/components/DataList';
import { stationDescriptions as statDesc } from 'src/modules/stations/columns';
import { KeyValue } from 'src/common/types/client';
import { commaJoin, formSafeObject } from 'src/common/utils/shared';
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

  const { read, write } = user.access.stations;

  const isActive = data?.active === 1;

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
    { key: statDesc.region, value: data?.region?.name },
    {
      key: 'Benutzer',
      value: usersString,
    },
  ];

  const editClickHandler = () => {
    setModalOpen(true);
  };

  const deactivateClickHandler = async () => {
    const active = isActive ? '0' : '1';
    await patchStation(id, { active });
    mutate();
  };

  const regions = useGetRegions();
  const options = regions.data?.map(selectOptionMapper) ?? [];
  const modalFields = stationFields(options);

  return (
    <Layout loading={isValidating} session={user} blockAccess={!read}>
      <Typography variant="h1" color={isActive ? undefined : 'error'}>
        {data?.name}
      </Typography>

      <DataList data={displayData} />

      {!write ? null : (
        <>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button onClick={editClickHandler}>Bearbeiten</Button>
            <Button
              color={isActive ? 'error' : 'success'}
              onClick={deactivateClickHandler}
            >
              {isActive ? 'Deaktivieren' : 'Aktivieren'}
            </Button>
          </Box>

          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <Form
              fields={modalFields}
              onSubmit={async (values) => {
                await putStation(id, values);
                await mutate();
                setModalOpen(false);
              }}
              cols={2}
              values={formSafeObject(data)}
              disabled={['id']}
            />
          </Modal>
        </>
      )}
    </Layout>
  );
}

export default SingleStationPage;
