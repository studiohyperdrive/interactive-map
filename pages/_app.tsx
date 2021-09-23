import "../styles/globals.css";
import "../styles/styles.css";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { useRouter } from "next/dist/client/router";
import type { AppProps } from "next/app";

import store from "../redux/store";

import WebGL from "../components/webgl/webgl";
import Tooltip from "../components/tooltip/tooltip";

function MyApp({ Component, pageProps }: AppProps) {
  const shouldShowMap = (url: string) => { return url === "/" };

  const router = useRouter();
  const [map, setMap] = useState(shouldShowMap(router.pathname));

  useEffect(() => {
    const handleStart = (url: string) => {
      setMap(shouldShowMap(url));
    };

    router.events.on("routeChangeStart", handleStart)

    return () => {
      router.events.off("routeChangeStart", handleStart)
    }
  }, [router]);

  return (
    <Provider store={store}>
      <main>
        {map && <Tooltip />}
        {map && <WebGL />}

        <Component {...pageProps} />
      </main>
    </Provider>
  )
}

export default MyApp
