import Router from 'next/router';
import Layout from '../components/Layout';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [edit, setEdit] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        Router.push('/');
        return <h1>Error, not logged in</h1>;
    } else {
        return (
            <Layout title="Profile">
                {edit ? (
                    <div className="profile-container">
                        <h2>Edit Profile</h2>
                        <form>
                            <div className="group">
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" placeholder={user.username} />
                            </div>
                            <div className="group">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" placeholder={user.email} />
                            </div>
                            <div className="group">
                                <label htmlFor="instagram">Instagram</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    placeholder={user.instagram ? user.instagram : 'none'}
                                />
                            </div>
                        </form>
                        <button onClick={() => setEdit(false)}>Cancel</button>
                    </div>
                ) : (
                    <div className="profile-container">
                        <div className="info">
                            <h2>username: {user.username}</h2>
                            <h2>email: {user.email}</h2>
                            <h2>
                                instagram handle:{' '}
                                {user.instagram ? user.instagram : <span>none</span>}
                            </h2>
                        </div>

                        <button onClick={() => setEdit(true)}>Edit Profile</button>
                        <button>Change Password</button>
                        <button>Delete Profile</button>
                    </div>
                )}
            </Layout>
        );
    }
};

export default Profile;
