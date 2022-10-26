import type { NextPage } from "next";
import Head from "next/head";

import Camera from "../components/camera/camera";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>새로 만들기</title>
        <meta name="description" content="새로 만들기" />
      </Head>

      <Camera />

      <footer></footer>
    </div>
  );
};

export default Home;
