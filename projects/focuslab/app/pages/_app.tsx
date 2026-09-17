import type { AppProps } from 'next/app';
import '../styles/global.css';
import '../styles/v071.css';
import '../styles/v071-art.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
