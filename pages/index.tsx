import { InferGetServerSidePropsType } from 'next';
import { withSessionSsr } from '../lib/withSession';
import Layout from '../components/layout/Layout';
// import styles from "../styles/Home.module.css";

// Home: NextPage
const Home = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout session={user}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod libero non justo
      sollicitudin ultricies. In hac habitasse platea dictumst. Nullam hendrerit viverra mi nec
      fringilla. Praesent at leo at orci euismod consectetur id nec ipsum. Etiam suscipit lorem at
      ex blandit sollicitudin. Nam venenatis erat in lectus malesuada, sed rutrum sapien molestie.
      Nam gravida sit amet leo luctus mollis. Phasellus laoreet et neque sit amet sollicitudin. Nunc
      at nisl mi. Morbi lectus felis, convallis nec dictum ut, porta ac tellus. Mauris finibus eros
      nisl, eu placerat lectus malesuada sed. Praesent non dolor lorem. Ut pulvinar metus in eros
      faucibus fringilla. Cras non libero vitae diam tempor volutpat. In viverra ligula a libero
      luctus aliquet in in libero. Mauris dui tortor, malesuada et magna sit amet, viverra suscipit
      nunc. In facilisis interdum aliquet. Aenean non turpis neque. Vestibulum a turpis at magna
      pharetra fermentum aliquam vitae magna. Nullam eu mollis lorem. Suspendisse hendrerit eu
      turpis vitae convallis. Donec mattis eros vel ipsum pharetra, eget volutpat odio cursus.
      Integer aliquet pellentesque nisl, eu consectetur odio semper sit amet. Aenean eget pulvinar
      ipsum. Etiam bibendum diam ac lectus consectetur sodales. Integer eu vulputate mi, sed
      ultricies eros. In eu diam eget massa venenatis viverra in sed magna. Donec gravida, ipsum
      quis consequat semper, turpis dui facilisis tellus, vel feugiat ex odio sit amet nunc. Integer
      molestie gravida iaculis. Duis ut libero mollis, luctus tellus in, laoreet nisl. Vivamus
      accumsan tristique pharetra. Maecenas neque libero, tincidunt ut gravida nec, pellentesque nec
      felis. In metus magna, vulputate non pharetra eu, commodo in dolor. Nunc tempus ligula non
      convallis pulvinar. Cras semper turpis ac mi consectetur pellentesque. Sed ut turpis a leo
      dictum lobortis. Sed felis turpis, efficitur nec tempor eget, eleifend sodales nisl. Nullam
      bibendum, dui eget tempus ornare, ex enim porttitor felis, non faucibus justo mauris in purus.
      Nullam ligula risus, sodales eget egestas in, lobortis vitae arcu. Sed rutrum tincidunt
      ligula, quis euismod libero suscipit sit amet. Fusce nec vestibulum turpis. Proin quis sem
      vitae mi blandit posuere vitae quis mi. Sed vel vestibulum massa. Morbi id pellentesque
      mauris, et condimentum orci. Ut congue lacus eget nisi lacinia congue. Donec blandit porta
      lectus, vel mattis ante laoreet posuere. Maecenas nec augue ut ipsum dignissim dictum. Fusce a
      ligula vitae nisi semper interdum eu quis lectus. Cras sit amet vestibulum est. Nulla ac augue
      id nisi imperdiet blandit. Aliquam egestas nibh vel aliquet vestibulum. Proin sit amet lorem
      nec odio fringilla consequat vitae ut ante. Curabitur tristique maximus lorem, eget commodo
      massa ornare vitae. Praesent molestie bibendum mi sed ultricies. Etiam vel lectus nunc. Nullam
      ut mi libero. Etiam volutpat quis leo ac mattis. Donec cursus tempus fringilla. In
      sollicitudin dictum odio, sed pretium nisl sollicitudin a. Maecenas porta porttitor est vel
      ultricies. Sed sem risus, malesuada a molestie in, suscipit id nibh. Fusce ornare, lectus nec
      vehicula finibus, dui est convallis orci, quis pharetra quam tortor vitae odio.
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr();

export default Home;
