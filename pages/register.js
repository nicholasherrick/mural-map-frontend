import Router from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useState, useRef, useEffect } from 'react';
import AuthService from '../services/AuthService';
import Message from '../components/Message';

const Register = (props) => {
  const [user, setUser] = useState({ email: '', username: '', password: '' });
  const [message, setMessage] = useState(null);
  let timerId = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const resetForm = () => {
    setUser({ email: '', username: '', password: '' });
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AuthService.register(user).then((data) => {
      const { message } = data;
      setMessage(message);
      resetForm();
      if (!message.msgError) {
        timerId = setTimeout(() => {
          Router.push('/login');
        }, 2000);
      }
    });
  };

  return (
    <Layout>
      <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                value={user.email}
                onChange={handleChange}
                placeholder='email@example.com'
              />
            </div>
            <div>
              <label htmlFor='email'>Username</label>
              <input
                type='text'
                name='username'
                value={user.username}
                onChange={handleChange}
                placeholder='username'
              />
            </div>
            <div>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                value={user.password}
                onChange={handleChange}
                placeholder='Enter password'
              />
            </div>
            <button type='submit'>Register</button>
            <p className='text-center'>
              Have an account? <Link href='/login'>Login</Link>
            </p>
            {message ? <Message message={message} /> : null}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
