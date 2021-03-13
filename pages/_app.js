import '../styles/globals.scss';
import '@reach/combobox/styles.css';
import React, { useState, useEffect } from 'react';
import AuthProvider from '../context/AuthContext';
import { useRouter } from 'next/router';
import Loader from '../components/Loader';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(false);
    useEffect(() => {
        const handleStart = () => {
            setPageLoading(true);
        };
        const handleComplete = () => {
            setPageLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);
    }, [router]);

    return pageLoading ? (
        <Loader />
    ) : (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
