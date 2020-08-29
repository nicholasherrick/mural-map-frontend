import Link from 'next/link';
import { useContext } from 'react';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

const Navbar = (props) => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(
    AuthContext
  );

  const handleLogout = () => {
    debugger;
    AuthService.logout().then((data) => {
      debugger;
      if (data.success) {
        debugger;
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  };

  const unauthenticatedNavbar = () => {
    return (
      <div>
        <ul>
          <li>
            <Link href='/'>
              <a>Welcome</a>
            </Link>
          </li>
          <li>
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href='/register'>
              <a>Register</a>
            </Link>
          </li>
        </ul>

        <style jsx>{`
          ul {
            display: flex;
            list-style: none;
            background: #333;
            color: #fff;
            margin: 0;
          }

          ul li {
            font-size: 2rem;
            margin-right: 2rem;
            padding: 1rem;
          }

          ul li a {
            color: #fff;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  };

  const authenticatedNavbar = () => {
    return (
      <div>
        <ul>
          <li>
            <Link href='/'>
              <a>Map</a>
            </Link>
          </li>
          <li>
            <a>Logged in as {user.username}</a>
          </li>
          <li>
            <button type='button' onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>

        <style jsx>{`
          ul {
            display: flex;
            list-style: none;
            background: #333;
            color: #fff;
            margin: 0;
          }

          ul li {
            font-size: 2rem;
            margin-right: 2rem;
            padding: 1rem;
          }

          ul li a {
            color: #fff;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  };

  return (
    <div>
      {!isAuthenticated ? unauthenticatedNavbar() : authenticatedNavbar()}
    </div>
  );
};

export default Navbar;
