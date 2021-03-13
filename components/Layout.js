import Head from 'next/head';
import Navbar from './Navbar';

const Layout = ({ background = null, title, children }) => {
    return (
        <div className={background === 'none' ? null : 'layout'}>
            <Head>
                <title>{title ? `${title} | Mural Map` : 'Mural Map'}</title>
            </Head>
            <Navbar />
            {children}
        </div>
    );
};

export default Layout;
