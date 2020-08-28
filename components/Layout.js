import Head from 'next/head';
import Navbar from './Navbar';

const Layout = (props) => {
  return (
    <div>
      <Head>
        <title>Mural Map</title>
      </Head>
      <Navbar />
      {props.children}
    </div>
  );
};

export default Layout;
