export default {
    register: (user) => {
        return fetch('/api/auth/register', {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res);
            if (res.ok) return res.json().then((data) => data);
            else
                return {
                    isAuthenticated: false,
                    user: { _id: '', email: '', username: '', instagram: '' },
                    message: { msgBody: 'Email and/or Username already in use', msgError: true }
                };
        });
    },
    login: (user) => {
        return fetch('/api/auth/login', {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 401) {
                return {
                    isAuthenticated: false,
                    user: { _id: '', email: '', username: '', instagram: '' },
                    message: { msgBody: 'Invalid email/password', msgError: true }
                };
            } else if (res.ok) {
                return res.json().then((data) => data);
            } else {
                return {
                    isAuthenticated: false,
                    user: { _id: '', email: '', username: '', instagram: '' }
                };
            }
        });
    },
    logout: () => {
        return fetch('/api/auth/logout')
            .then((res) => res.json())
            .then((data) => data);
    },
    // Sync back-end and front-end so session persists even if window closes
    isAuthenticated: () => {
        return fetch('/api/auth/authenticated').then((res) => {
            if (res.ok) return res.json().then((data) => data);
            else
                return {
                    isAuthenticated: false,
                    user: { _id: '', email: '', username: '', instagram: '' }
                };
        });
    }
};
