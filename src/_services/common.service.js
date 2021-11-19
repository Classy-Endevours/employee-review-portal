import config from '../config.json';

export const callApi = (
  endpoint,
  options = { method: 'get', timeout: 10000 }
) => {
  const url = `${config.apiUrl}/${endpoint}`;
  console.log('url', url);
  return fetch(url, {
    ...options
  })
    .then(res => {
      if (res.ok) {
        return res.text();
      } else {
        throw new Error('Failed to retrieve data from server');
      }
    })
      // .catch(err => {
      //   console.error('Failed to retrieve data from server\n', err);
      //   throw err;
      // }); 
  .then(text => {
    console.log('text', text);
    // if (text == "OK") return text;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  })
};
