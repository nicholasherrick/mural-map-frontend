import Layout from '../components/Layout';
import { useState, useContext } from 'react';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

const Auth = (props) => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const authContext = useContext(AuthContext);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AuthService.login(user).then((data) => {
      const { isAuthenticated, user, message } = data;
      if (isAuthenticated) {
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);
        props.history.push('/todos');
      } else {
        setMessage(message);
      }
    });
  };

  return (
    <Layout>
      <div>
        <h1>Welcome to Mural Map</h1>
        <h2>Login/Register</h2>
        <form onSubmit={handleSubmit}>
          <div className='col-md-6 mx-auto'>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                onChange={handleChange}
                className='form-control'
                placeholder='email@example.com'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                onChange={handleChange}
                className='form-control'
                placeholder='Enter password'
              />
            </div>
            <button className='btn btn-lg btn-primary btn-block' type='submit'>
              Login
            </button>
            {/* {message ? <Message message={message} /> : null} */}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Auth;
