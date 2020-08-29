import '../styles/globals.css';
import '@reach/combobox/styles.css';
import AuthProvider from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
