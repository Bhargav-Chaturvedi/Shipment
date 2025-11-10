import "../styles/globals.css";
import { TrackingProvider } from "../Conetxt/TrackingContext";

function MyApp({ Component, pageProps }) {
  return (
    <TrackingProvider>
      <Component {...pageProps} />
    </TrackingProvider>
  );
}

export default MyApp;
