import '../styles/globals.scss';
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
