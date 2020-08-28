import Link from 'next/link';

const Navbar = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href='/'>
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href='/auth'>
            <a>Login/Register</a>
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

export default Navbar;
