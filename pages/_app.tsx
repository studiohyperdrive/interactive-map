import "../styles/globals.css";
import "../styles/styles.css";
import type { AppProps } from "next/app";

import store from "../redux/store";

import WebGL from "../components/webgl/webgl";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <WebGL three={store.getState().three}/>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp
