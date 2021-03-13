import Router from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import Message from '../components/Message';
import { useState, useContext } from 'react';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);
    const { isAuthenticated } = useContext(AuthContext);

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: user.email.toLowerCase(),
            password: user.password
        };
        AuthService.login(userData).then((data) => {
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

    if (isAuthenticated) {
        Router.push('/');
        return <h1>Error, already logged in</h1>;
    } else {
        return (
            <Layout title="Login">
                <div className="login-form">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-div">
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    placeholder="enter password"
                                />
                            </div>
                            <button type="submit">Login</button>
                            <p className="text-center">
                                Need an account?{' '}
                                <Link href="/register">
                                    <a>Register</a>
                                </Link>
                            </p>
                            {message ? <Message message={message} /> : null}
                        </div>
                    </form>
                </div>
            </Layout>
        );
    }
};

export default Login;
