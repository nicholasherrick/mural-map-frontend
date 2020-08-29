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
      <div className='login-form'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <div className='input-group'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                onChange={handleChange}
                placeholder='email@example.com'
              />
            </div>
            <div className='input-group'>
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
              Need an account?{' '}
              <Link href='/register'>
                <a>Register</a>
              </Link>
            </p>
            {message ? <Message message={message} /> : null}
          </div>
        </form>
      </div>

      <style jsx>{`
        .login-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: black 1px solid;
          max-width: 25rem;
          margin: auto;
          margin-top: 3rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          max-width: 16rem;
        }

        input {
          padding: 0.4rem;
          font-size: 1.2rem;
          width: 100%;
        }

        button {
          margin-top: 1rem;
          padding: 0.5rem 1.5rem;
          background-color: blue;
          border: none;
          color: white;
          font-weight: bold;
          border-radius: 15px;
        }

        button:hover {
          cursor: pointer;
        }

        a {
          color: blue;
        }
      `}</style>
    </Layout>
  );
};

export default Auth;
