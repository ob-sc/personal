import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import useRequest from '../../src/client/hooks/useRequest';
import DBUser from '../../src/db/users';
import MultiSelect from '../../src/client/components/common/MultiSelect';
import { useForm } from 'react-hook-form';

export const getServerSideProps = withSessionSsr();

const SingleUserPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useRequest<DBUser>({
    url: `/api/users/${id}`,
    method: 'get',
  });
  console.log(data);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  return (
    <Layout loading={isValidating} session={user}>
      <form
        onSubmit={handleSubmit((values) => {
          console.log(values);
        })}
      >
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <MultiSelect
              name="stations"
              label="Stationen"
              options={[
                { optval: 'hi', optlabel: 'ho' },
                { optval: 'hu', optlabel: 'ha' },
              ]}
              control={control}
              errors={errors}
            />
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
};

export default SingleUserPage;
