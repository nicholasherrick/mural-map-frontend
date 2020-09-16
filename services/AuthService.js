export default {
  register: (user) => {
    return fetch('/api/auth/register', {
      method: 'post',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else
        return {
          isAuthenticated: false,
          user: { _id: '', email: '', username: '' },
        };
    });
  },
  login: (user) => {
    return fetch('/api/auth/login', {
      method: 'post',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else
        return {
          isAuthenticated: false,
          user: { _id: '', email: '', username: '' },
        };
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
      if (res.status !== 401) return res.json().then((data) => data);
      else
        return {
          isAuthenticated: false,
          user: { _id: '', email: '', username: '' },
        };
    });
  },
};
