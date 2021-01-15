import { Binding } from './';
import { QueryData } from './../query';

export default class CloudStorageBinding implements Binding {
  serverUrl: string;
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }
  perform(query: QueryData): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!query.operation) {
          reject('Invalid query');
        }
        let resp = await fetch(`${this.serverUrl}/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(query),
        });
        let data = await resp.json();
        resolve(JSON.parse(data.data));
      } catch (err) {
        reject(err);
      }
    });
  }
  getAllCollections(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let resp = await fetch(`${this.serverUrl}/get-collections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        let data = await resp.json();
        resolve(JSON.parse(data.data));
      } catch (err) {
        reject(err);
      }
    });
  }
}
