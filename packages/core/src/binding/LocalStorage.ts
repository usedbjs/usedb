import { filter, findIndex, isEmpty } from 'lodash';
import { Binding } from './';
import { QueryData } from './../query';

export default class LocalStorageBinding implements Binding {
  db: any = typeof window !== undefined ? localStorage : {};
  getAllCollections(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve([]);
      } catch (err) {
        reject(err);
      }
    });
  }
  perform(query: QueryData): Promise<any> {
    if (!this.db.getItem(query.collection)) {
      this.db.setItem(query.collection, JSON.stringify([]));
    }
    return new Promise((resolve, reject) => {
      try {
        if (!query.operation) {
          reject('Invalid query');
        }
        let data = JSON.parse(this.db.getItem(query.collection));
        let queryResponse = this.processQueryAndUpdateCollection(data, query);

        if (queryResponse.error) {
          reject(queryResponse.error);
        }
        this.db.setItem(query.collection, JSON.stringify(data));
        resolve(queryResponse.data);
      } catch (err) {
        reject(err);
      }
    });
  }
  private processQueryAndUpdateCollection(
    storageCollection: any,
    query: QueryData
  ): { data: any; error?: any } {
    const { operation, payload } = query;
    let returnValue: any;
    switch (operation) {
      case 'create':
        storageCollection.push(payload.data);
        break;
      case 'update':
        if (payload.hasOwnProperty('where')) {
          let index = findIndex(storageCollection, payload.where);
          if (index !== -1 && payload.hasOwnProperty('data')) {
            for (let childData in payload.data) {
              storageCollection[index][childData] = payload.data[childData];
            }
          }
        }
        break;
      case 'findOne':
        if (payload.hasOwnProperty('where')) {
          let val = filter(storageCollection, payload.where);
          returnValue = val.length ? val[0] : undefined;
        }
        if (payload.hasOwnProperty('select')) {
          let queryResult: any = {};
          payload.select.forEach((selectOption: string) => {
            queryResult[selectOption] = returnValue[selectOption];
          });
          returnValue = !isEmpty(queryResult) ? queryResult : undefined;
        }
        break;
      case 'findMany':
        if (payload.hasOwnProperty('where')) {
          returnValue = filter(storageCollection, payload.where);
        }
        if (payload.hasOwnProperty('select')) {
          let queryResults: any = [];
          returnValue.forEach((_result: any, index: number) => {
            queryResults.push({});
            payload.select.forEach((selectOption: string) => {
              queryResults[index][selectOption] =
                returnValue[index][selectOption];
            });
          });
          returnValue = queryResults;
        }
        break;
      case 'delete':
        if (payload.hasOwnProperty('where')) {
          let index = findIndex(storageCollection, payload.where);
          if (index !== -1) {
            returnValue = storageCollection[index];
            storageCollection.splice(index, 1);
          }
        }
        if (returnValue && payload.hasOwnProperty('select')) {
          let queryResult: any = {};
          payload.select.forEach((selectOption: string) => {
            queryResult[selectOption] = returnValue[selectOption];
          });
          returnValue = !isEmpty(queryResult) ? queryResult : undefined;
        }
        break;
      case 'deleteMany':
        if (payload.hasOwnProperty('where')) {
          let count = 0;
          let valuesToDelete = filter(storageCollection, payload.where);
          valuesToDelete.forEach(val => {
            let index = findIndex(storageCollection, val);
            if (index !== -1) {
              count++;
              storageCollection.splice(index, 1);
            }
          });
          returnValue = count;
        }
        break;
      case 'count':
        if (payload.hasOwnProperty('where')) {
          let values = filter(storageCollection, payload.where);
          returnValue = values.length;
        }
        break;
      default:
        break;
    }
    return { data: returnValue };
  }
}
