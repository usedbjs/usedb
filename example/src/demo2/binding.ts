import { Binding, QueryData } from '@usedb/core';
const getURL = 'http://e61f353fe494.ngrok.io/api/usedb';

export class MyBinding implements Binding {
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
