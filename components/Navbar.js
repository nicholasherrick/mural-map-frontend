import Link from 'next/link';
import { useContext } from 'react';
import AuthService from '../services/AuthService';
import { AuthContext } from '../context/AuthContext';

const Navbar = (props) => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(
    AuthContext
  );

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
      <div className='navbar'>
        <ul>
          <li>
            <Link href='/'>
              <a>Map</a>
            </Link>
          </li>
          <div className='auth-links'>
            <li>
              <Link href='/login'>
                <button>Login</button>
              </Link>
            </li>
            <li>
              <Link href='/register'>
                <button>Register</button>
              </Link>
            </li>
          </div>
        </ul>

        <style jsx>{`
          .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 10;
          }

          ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            list-style: none;
            background: #333;
            color: #fff;
            margin: 0;
            width: 100%;
          }

          ul li {
            padding: 1rem;
          }

          ul li a {
            color: #fff;
            text-decoration: none;
            font-size: 2rem;
            margin-right: 2rem;
            padding: 1rem;
          }

          .auth-links {
            display: flex;
          }

          button {
            padding: 0.5rem 1rem;
            background-color: yellow;
            font-weight: bold;
            border: black solid 2px;
            font-size: 1rem;
          }

          @media screen and (max-width: 400px) {
            ul li {
              margin-right: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  const authenticatedNavbar = () => {
    return (
      <div className='navbar'>
        <ul>
          <div className='app-links'>
            <li>
              <Link href='/'>
                <a>Mural Map</a>
              </Link>
            </li>
            <li>
              <Link href='profile'>
                <a>Profile</a>
              </Link>
            </li>
          </div>
          <div className='auth-links'>
            <li>
              <Link href='/profile'>
                <a>Logged in as {user.username}</a>
              </Link>
            </li>
            <li>
              <button type='button' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </div>
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
            justify-content: space-between;
            align-items: center;
            list-style: none;
            background: #333;
            color: #fff;
            margin: 0;
            width: 100%;
          }

          ul li {
            margin-right: 2rem;
            padding: 1rem;
          }

          ul li a {
            color: #fff;
            text-decoration: none;
            font-size: 2rem;
          }

          .app-links {
            display: flex;
          }

          .auth-links {
            display: flex;
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

          @media screen and (max-width: 720px) {
            .app-links {
              flex-direction: column;
            }

            .auth-links {
              flex-direction: column;
            }

            ul {
              flex-direction: column;
            }

            ul li {
              padding: 0.3rem 0;
              margin: 0;
              text-align: center;
            }

            ul li a {
              font-size: 1.1rem;
            }
          }

          @media screen and (max-width: 400px) {
            ul li {
              margin-right: 0;
            }
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
