import Router from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import Message from '../components/Message';
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
        Router.push('/');
      } else {
        setMessage(message);
      }
    });
  };

  return (
    <Layout>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                onChange={handleChange}
                placeholder='email@example.com'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                onChange={handleChange}
                placeholder='Enter password'
              />
            </div>
            <button type='submit'>Login</button>
            <p className='text-center'>
              Need an account? <Link href='/register'>Register</Link>
            </p>
            {message ? <Message message={message} /> : null}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Auth;
