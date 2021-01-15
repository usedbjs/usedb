import { filter, findIndex, isEmpty } from 'lodash';
import { QueryData, Binding } from '../../src/index';

const artificialDelay = (fn: any) => setTimeout(fn, 1000);

export default class RuntimeBinding implements Binding {
  db: any = {};
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
    if (!this.db[query.collection]) {
      this.db[query.collection] = [];
    }
    // CAUTION: remove this
    // @ts-ignore
    window['db'] = this.db;
    return new Promise((resolve, reject) => {
      artificialDelay(() => {
        try {
          if (!query.operation) {
            reject('Invalid query');
          }
          let queryResponse = this.processQuery(query);

          if (queryResponse.error) {
            reject(queryResponse.error);
          }
          resolve(queryResponse.data);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
  private processQuery(query: QueryData): { data: any; error?: any } {
    const { collection, operation, payload } = query;
    let returnValue: any;
    switch (operation) {
      case 'create':
        const data = { id: Math.random().toString(), ...payload.data };
        this.db[collection].push(data);
        returnValue = data;
        break;
      case 'update':
        if (payload.hasOwnProperty('where')) {
          let index = findIndex(this.db[collection], payload.where);
          if (index !== -1 && payload.hasOwnProperty('data')) {
            for (let childData in payload.data) {
              this.db[collection][index][childData] = payload.data[childData];
            }
          }
        }
        break;
      case 'findOne':
        if (payload.hasOwnProperty('where')) {
          let val = filter(this.db[collection], payload.where);
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
          returnValue = filter(this.db[collection], payload.where);
          if (returnValue.length === 0) {
            throw new Error('404 Not found');
          }
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
          let index = findIndex(this.db[collection], payload.where);
          if (index !== -1) {
            returnValue = this.db[collection][index];
            this.db[collection].splice(index, 1);
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
          let valuesToDelete = filter(this.db[collection], payload.where);
          valuesToDelete.forEach(val => {
            let index = findIndex(this.db[collection], val);
            if (index !== -1) {
              count++;
              this.db[collection].splice(index, 1);
            }
          });
          returnValue = count;
        }
        break;
      case 'count':
        if (payload.hasOwnProperty('where')) {
          let values = filter(this.db[collection], payload.where);
          returnValue = values.length;
        }
        break;
      default:
        break;
    }
    return { data: returnValue };
  }
}
