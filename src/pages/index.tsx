import type { NextPage } from "next";
import Link from "next/link";
import useSwr from "swr";
import Head from "next/head";
import axios from "axios";
import styles from "../styles/Home.module.css";

interface User {
  id: number;
  name: string;
}

const Home: NextPage = () => {
  const { data, error } = useSwr("/api/users", axios);

  if (error) return <div>Failed to load users</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <Head>
        <title>monorepo POC</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul>
        {data.map((user) => (
          <li key={user.id}>
            <Link href="/user/[id]" as={`/user/${user.id}`}>
              <a>{`User ${user.id}`}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
