import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import WebGL from '../components/webgl/webgl';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Interactive map | SHD</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WebGL />
    </div>
  )
}

export default Home
