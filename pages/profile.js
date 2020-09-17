import Layout from '../components/Layout';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);

  return (
    <Layout>
      {edit ? (
        <div className='profile-container'>
          <h2>Edit Profile</h2>
          <form>
            <div className='group'>
              <label htmlFor='username'>Username</label>
              <input type='text' name='username' placeholder={user.username} />
            </div>
            <div className='group'>
              <label htmlFor='email'>Email</label>
              <input type='email' name='email' placeholder={user.email} />
            </div>
            <div className='group'>
              <label htmlFor='instagram'>Instagram</label>
              <input
                type='text'
                name='instagram'
                placeholder={user.instagram ? user.instagram : 'none'}
              />
            </div>
          </form>
          <button onClick={() => setEdit(false)}>Cancel</button>
        </div>
      ) : (
        <div className='profile-container'>
          <h2>username: {user.username}</h2>
          <h2>email: {user.email}</h2>
          <h2>
            instagram handle:{' '}
            {user.instagram ? user.instagram : <span>none</span>}
          </h2>
          <button onClick={() => setEdit(true)}>Edit Profile</button>
          <button>Change Password</button>
          <button>Delete Profile</button>
        </div>
      )}

      <style jsx>{`
        .profile-container {
          position: absolute;
          left: 50%;
          margin-top: 7rem;
        }

        .group {
          display: flex;
          flex-direction: column;
        }

        input {
          padding: 0.4rem;
          font-size: 1.2rem;
          width: 100%;
        }

        label {
          margin: 0.5rem 0;
        }

        span {
          opacity: 50%;
        }

        button {
          margin: 1rem 1rem 0 0;
        }
      `}</style>
    </Layout>
  );
};

export default Profile;
