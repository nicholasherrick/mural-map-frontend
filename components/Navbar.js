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
      <div className='navbar'>
        <ul>
          <li>
            <Link href='/'>
              <a>Map</a>
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
          .navbar {
            position: fixed;
            width: 100%;
            z-index: 10;
          }

          ul {
            display: flex;
            list-style: none;
            background: #333;
            color: #fff;
            margin: 0;
            width: 100%;
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
      <div className='navbar'>
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
          .navbar {
            position: fixed;
            width: 100%;
            z-index: 10;
          }

          ul {
            padding: 0;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            list-style: none;
            background: #333;
            color: #fff;
            margin: 0;
            width: 100%;
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

          button {
            padding: 0.5rem 1rem;
            background-color: yellow;
            font-weight: bold;
            border: black solid 2px;
            font-size: 1rem;
          }

          button:hover {
            cursor: pointer;
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
