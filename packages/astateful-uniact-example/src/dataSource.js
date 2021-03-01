import fetch from 'isomorphic-fetch';

class DataSource {
  request = (options, endpoint) => {
    return fetch(`https://api-v2.hearthis.at${endpoint}`, options).then(
      response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          return response.json().then(error => {
            let e = new Error(error.message);
            e.status = response.status; // hack, needed for isomorphic use cases
            throw e;
          });
        }
      }
    );
  };

  get = endpoint => {
    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    return this.request(options, endpoint);
  };
}

export default DataSource;
