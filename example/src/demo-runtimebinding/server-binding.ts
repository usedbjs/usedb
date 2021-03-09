import { Binding, QueryData } from '@usedb/core';
const getURL = 'http://localhost:3004/api/usedb';

export class ServerBinding implements Binding {
  getAllCollections(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve([]);
      } catch (err) {
        reject(err);
      }
    });
  }
  async perform(query: QueryData) {
    console.log('QUERY :: ', query);
    const res = await fetch(getURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    const json = await res.json();

    console.log('BINDING RESPONSE :: ', json);

    return json;
  }
}
