import { filter, findIndex, isEmpty } from 'lodash';
import { QueryData, Binding } from '../../src/index';

const artificialDelay = (fn: any) => setTimeout(fn, 1000);

const randomPosts = [
  { id: '1', title: 'post1' },
  { id: '2', title: 'post2' },
  { id: '3', title: 'post3' },
  { id: '4', title: 'post4' },
  { id: '5', title: 'post5' },
  { id: '6', title: 'post2' },
  { id: '7', title: 'kwd' },
  { id: '8', title: '1jdn' },
  { id: '9', title: 'dkdk' },
  { id: '10', title: 'djtr' },
  { id: '11', title: 'fijf' },
  { id: '12', title: 'djr' },
  { id: '13', title: 'fmijr' },
  { id: '14', title: 'fnif' },
  { id: '15', title: 'fnir' },
];

export default class RuntimeBinding implements Binding {
  db: any = { Post: randomPosts };
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
            returnValue = this.db[collection][index];
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
        } else {
          returnValue = this.db[collection];
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
