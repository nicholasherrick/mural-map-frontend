import Router from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useState, useContext, useRef, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';

const Register = () => {
    const [user, setUser] = useState({
        email: '',
        username: '',
        password: '',
        repeatPassword: '',
        instagram: ''
    });
    const [message, setMessage] = useState(null);
    console.log(message);
    let timerId = useRef(null);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        return () => {
            clearTimeout(timerId);
        };
    }, []);

    const resetForm = () => {
        setUser({
            email: '',
            username: '',
            password: '',
            repeatPassword: '',
            instagram: ''
        });
    };

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (user.password === user.repeatPassword) {
            const userData = {
                email: user.email.toLowerCase(),
                username: user.username,
                password: user.password,
                instagram: user.instagram.toLowerCase()
            };
            AuthService.register(userData).then((data) => {
                const { message } = data;
                setMessage(message);
                if (!message.msgError) {
                    timerId = setTimeout(() => {
                        Router.push('/login');
                    }, 2000);
                }
            });
        } else {
            setMessage({ msgBody: 'Passwords must match', msgError: true });
        }
    };

    if (isAuthenticated) {
        Router.push('/');
        return <h1>Error, already logged in</h1>;
    } else {
        return (
            <Layout title="Register">
                <div className="register-form">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-div">
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    placeholder="username"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="instagram">Instagram (optional)</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={user.instagram}
                                    onChange={handleChange}
                                    placeholder="instagram"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder="enter password"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="repeatPassword">Retype Password</label>
                                <input
                                    type="password"
                                    name="repeatPassword"
                                    value={user.repeatPassword}
                                    onChange={handleChange}
                                    placeholder="retype password"
                                />
                            </div>
                            <button type="submit">Register</button>
                            <p>
                                Have an account?{' '}
                                <Link href="/login">
                                    <a>Login</a>
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

export default Register;
