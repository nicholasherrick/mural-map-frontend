import axios from 'axios';

const headers = {
  headers: {
    'content-type': 'multipart/form-data',
  },
};

export default {
  getMurals: () => {
    return fetch('/api/murals').then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else return { message: { msgBody: 'Unauthorized' }, msgError: true };
    });
  },
  createMural: (mural, userId) => {
    return axios
      .post(`/api/users/${userId}/mural/create`, mural, headers)
      .then((response) => {
        console.log(response);
        if (response.status !== 401) {
          return response;
        } else return { message: { msgBody: 'Unauthorized' }, msgError: true };
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deleteMural: (muralId, userId) => {
    return fetch(`/api/users/${userId}/mural/delete/${muralId}`, {
      method: 'delete',
    }).then((response) => {
      if (response.status !== 401) {
        return response;
      } else return { message: { msgBody: 'Unauthorized' }, msgError: true };
    });
  },
};
