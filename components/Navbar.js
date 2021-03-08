import Link from 'next/link';
import { useContext } from 'react';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

const Navbar = (props) => {
    const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

    const handleLogout = () => {
        AuthService.logout().then((data) => {
            if (data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
            }
        });
    };

    const unauthenticatedNavbar = () => {
        return (
            <div className="navbar">
                <ul>
                    <li>
                        <Link href="/">
                            <a>Mural Map</a>
                        </Link>
                    </li>
                    <div className="auth-links">
                        <li>
                            <Link href="/login">
                                <button>Login</button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/register">
                                <button>Register</button>
                            </Link>
                        </li>
                    </div>
                </ul>
            </div>
        );
    };

    const authenticatedNavbar = () => {
        return (
            <div className="navbar">
                <ul>
                    <div className="app-links">
                        <li>
                            <Link href="/">
                                <a>Mural Map</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="profile">
                                <a>Profile</a>
                            </Link>
                        </li>
                    </div>
                    <div className="auth-links">
                        <li>
                            <Link href="/profile">
                                <p>Logged in as {user.username}</p>
                            </Link>
                        </li>
                        <li>
                            <button type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </div>
                </ul>
            </div>
        );
    };

    return <div>{!isAuthenticated ? unauthenticatedNavbar() : authenticatedNavbar()}</div>;
};

export default Navbar;
