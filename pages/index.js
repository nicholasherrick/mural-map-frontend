import Layout from '../components/Layout';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Layout>
      <div>{!isAuthenticated ? <h1>Welcome to Mural Map</h1> : null}</div>
    </Layout>
  );
};

export default Index;
