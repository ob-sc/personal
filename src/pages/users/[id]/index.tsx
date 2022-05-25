import { InferGetServerSidePropsType as IPT } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { errorText } from 'src/config/constants';
import { withSessionSsr } from 'src/common/middleware/withSession';
import { useGetStations } from 'src/modules/stations/api';
import { useGetUser } from 'src/modules/users/api';
import Layout from 'src/common/components/Layout';
import StationsContainer from 'src/modules/users/components/AllowedStationsContainer';
import DataList from 'src/common/components/DataList';

export const getServerSideProps = withSessionSsr();

function SingleUserPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetUser(Number(id));

  const stations = useGetStations();

  const { fullName, username, location, email } = data ?? {};

  console.log(data);

  const listData = [
    { key: 'Benutzername', value: username },
    { key: 'Benutzergruppe', value: location },
    { key: 'E-Mail', value: email },
  ];

  const { read: hasRead, write: hasWrite } = user.access.users;

  return (
    <Layout loading={isValidating} session={user} blockAccess={!hasRead} flex>
      <Typography variant="h2">{fullName}</Typography>
      {data !== undefined ? (
        <>
          <DataList data={listData} />
          <StationsContainer stations={stations.data ?? []} user={data} />
        </>
      ) : (
        <Typography>{errorText}</Typography>
      )}
    </Layout>
  );
}

export default SingleUserPage;

// todo wochenende siehe pages/users/index

// todo es fehlt noch eintritt, crent,

// todo anpassen mit write: stationen, region, berechtigungen

// todo knopf für austritt / wechsel
