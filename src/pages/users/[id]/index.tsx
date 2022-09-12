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
import UserAuthorizationTable from 'src/modules/users/components/UserAuthorizationTable';

export const getServerSideProps = withSessionSsr();

function SingleUserPage({ user }: IPT<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating, mutate } = useGetUser(Number(id));

  const stations = useGetStations();

  const {
    fullName,
    username,
    location,
    email,
    entryDate,
    crent,
    hardware,
    qlik,
    active,
    access,
  } = data ?? {};

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
    qlik ? { key: 'Qlik', value: qlik } : undefined,
  ];

  const { read: hasRead, write: hasWrite } = user.access.users;

  return (
    <Layout loading={isValidating} session={user} blockAccess={!hasRead} flex>
      <Typography variant="h1" color={active === 1 ? undefined : 'error'}>
        {fullName}
      </Typography>

      {data !== undefined ? (
        <>
          <DataList data={generalData} />

          {crent ? (
            <>
              <Typography variant="h2">C-Rent</Typography>
              <DataList
                data={[
                  { key: 'Benutzer', value: crent.username },
                  { key: 'Personalnummer', value: crent.personell_id },
                  { key: 'Kassenkonto', value: crent.register_id },
                ]}
              />
            </>
          ) : null}

          {hasWrite && hardware ? (
            <>
              <Typography variant="h2">Hardware</Typography>
              <DataList
                data={[
                  { key: 'Handy', value: hardware.mobile_phone === 1 },
                  { key: 'Laptop', value: hardware.laptop === 1 },
                  { key: 'Computer', value: hardware.computer === 1 },
                  { key: 'Monitor', value: hardware.monitor },
                  { key: 'Drucker', value: hardware.printer === 1 },
                  { key: 'Tankkarte', value: hardware.fuel_card === 1 },
                  { key: 'iPad', value: hardware.ipad === 1 },
                  { key: 'iPad Typ / Zubehör', value: hardware.ipad_extra },
                  { key: 'Sonstige Hardware', value: hardware.other },
                  {
                    key: 'Hardware-Freigabe durch',
                    value: hardware.authorization,
                  },
                ]}
              />
            </>
          ) : null}

          {hasWrite ? (
            <>
              <Typography variant="h2">Freigaben</Typography>
              <UserAuthorizationTable
                id={Number(id)}
                access={access}
                mutate={mutate}
              />
            </>
          ) : null}

          {hasWrite ? (
            <>
              <Typography variant="h2">Stationen</Typography>
              {/* todo region holen mit subrelation, hier dann anhaken https://stackoverflow.com/a/59718030 */}
              <StationsContainer stations={stations.data ?? []} user={data} />
            </>
          ) : null}
        </>
      ) : (
        <Typography>{errorText}</Typography>
      )}
    </Layout>
  );
}

export default SingleUserPage;

// todo anpassen mit write: stationen, region, berechtigungen

// todo knopf für austritt / wechsel
