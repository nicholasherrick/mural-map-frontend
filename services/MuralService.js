export default {
  getMurals: () => {
    return fetch('/api/murals').then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else return { message: { msgBody: 'Unauthorized' }, msgError: true };
    });
  },
  createMural: (mural) => {
    return fetch('/api/user/id/mural/create', {
      method: 'post',
      body: JSON.stringify(mural),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else return { message: { msgBody: 'Unauthorized' }, msgError: true };
    });
  },
};
