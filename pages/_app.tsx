import "../styles/globals.css";
import "../styles/styles.css";

import { useEffect } from "react";

import { useRouter } from "next/dist/client/router";
import type { AppProps } from "next/app";

import store from "../redux/store";

import WebGL from "../components/webgl/webgl";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const shouldShowMap = (url: string) => { return url === "/" };

  let map = shouldShowMap(router.pathname);

  useEffect(() => {
    const handleStart = (url: string) => {
      map = shouldShowMap(url);
    };

    router.events.on("routeChangeStart", handleStart)

    return () => {
      router.events.off("routeChangeStart", handleStart)
    }
  }, []);

  return map ? (
    <main>
      <WebGL three={store.getState().three}/>
      <Component {...pageProps} />
    </main>
  ) : (
    <main>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp
