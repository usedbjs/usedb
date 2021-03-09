import { QueryData } from './query';
import { Binding } from './binding';
import { DBInstance } from './cache/mst-cache';

export class Connection {
  private bind: Binding;
  cache: DBInstance;
  constructor({ bind, db }: { bind: Binding; db: DBInstance }) {
    this.bind = bind;
    this.cache = db;
  }
  setBinding(bind: Binding) {
    this.bind = bind;
  }
  getAllCollections(): Promise<any> {
    return this.bind.getAllCollections();
  }
  query(query: QueryData, _disableCache?: boolean): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.bind
        .perform(query)
        .then(resp => {
          resolve(resp);
        })
        .catch(error => {
          console.log('error ', error);
          reject(error);
        });
    });
  }
}
