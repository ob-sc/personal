import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { withSessionSsr } from '../../src/lib/withSession';
import Layout from '../../src/client/components/layout/Layout';
import MultiSelect from '../../src/client/components/common/MultiSelect';
import { useGetUser } from '../../src/client/api/users';

export const getServerSideProps = withSessionSsr();

const SingleUserPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isValidating } = useGetUser(Number(id));

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
          <Grid item xs={3}>
            <MultiSelect
              name="stations"
              label="Extrastationen"
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
