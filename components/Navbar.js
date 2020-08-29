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
          }

          ul li {
            font-size: 2rem;
            margin-right: 2rem;
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
              <a>Murals</a>
            </Link>
          </li>
          <li>
            <button type='button' onClick={handleLogout}>
              Logout {user.email}
            </button>
          </li>
        </ul>

        <style jsx>{`
          ul {
            display: flex;
            list-style: none;
            background: #333;
            color: #fff;
          }

          ul li {
            font-size: 2rem;
            margin-right: 2rem;
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
