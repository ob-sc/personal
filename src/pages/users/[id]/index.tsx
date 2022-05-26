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
import { toDeLocalDate } from 'src/common/utils/shared';

export const getServerSideProps = withSessionSsr();

function SingleUserPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetUser(Number(id));

  const stations = useGetStations();

  const { fullName, username, location, email, entryDate } = data ?? {};

  console.log(data);

  const generalData = [
    entryDate
      ? {
          key: 'Eintritt',
          value: toDeLocalDate(new Date(entryDate)),
        }
      : undefined,
    { key: 'Benutzername', value: username },
    {
      key: typeof location === 'number' ? 'Station' : 'Abteilung',
      value: location,
    },
    { key: 'E-Mail', value: email },
  ];

  const { read: hasRead } = user.access.users;
  // const { read: hasRead, write: hasWrite } = user.access.users;

  return (
    <Layout loading={isValidating} session={user} blockAccess={!hasRead} flex>
      <Typography variant="h1">{fullName}</Typography>
      {data !== undefined ? (
        <>
          <DataList data={generalData} />

          <Typography variant="h2">C-Rent</Typography>

          {/* todo region holen mit subrelation, hier dann anhaken https://stackoverflow.com/a/59718030 */}
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

// todo anpassen mit write: stationen, region, berechtigungen

// todo knopf für austritt / wechsel
