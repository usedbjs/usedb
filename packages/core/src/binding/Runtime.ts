import { filter, findIndex, isEmpty } from 'lodash';
import { QueryData, Binding } from '../../src/index';

const artificialDelay = (fn: any) => setTimeout(fn, 500);

const handleSkipTakePagination = ({
  skip,
  take,
  data,
}: {
  skip: number;
  take: number;
  data: any[];
}) => {
  return {
    data: data.slice(skip, skip + take),
    pagination: {
      total: data.length,
    },
  };
};

const handleCursorPagination = ({
  cursor,
  take,
  data,
}: {
  cursor: { id: any };
  take: number;
  data: any[];
}) => {
  let result = [...data];
  const index = result.findIndex(r => r.id === cursor.id);
  result = data.slice(index + 1, index + 1 + take);

  const nextCursor = data[index + take]?.id;

  console.log('next cursor ', nextCursor);

  return {
    data: result,
    pagination: {
      cursor: {
        id: nextCursor,
      },
    },
  };
};

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

          resolve(queryResponse);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
  private processQuery(query: QueryData): any {
    const { collection, operation, payload } = query;
    let returnValue: any;
    switch (operation) {
      case 'create':
        const data = { id: Math.random(), ...payload.data };
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
      case 'findMany': {
        let data: any = [];
        if (payload.hasOwnProperty('where')) {
          data = filter(this.db[collection], payload.where);
        } else {
          data = this.db[collection];
        }

        if (payload.hasOwnProperty('select')) {
          let queryResults: any = [];
          data.forEach((_result: any, index: number) => {
            queryResults.push({});
            payload.select.forEach((selectOption: string) => {
              queryResults[index][selectOption] = data[index][selectOption];
            });
          });
          data = queryResults;
        }

        if (payload.hasOwnProperty('cursor')) {
          returnValue = handleCursorPagination({
            cursor: payload.cursor,
            take: payload.take,
            data,
          });
        } else if (payload.hasOwnProperty('skip')) {
          returnValue = handleSkipTakePagination({
            skip: payload.skip,
            take: payload.take,
            data,
          });
        } else {
          returnValue = data;
        }

        break;
      }

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

    console.log('BINDING RESPONSE :: ', returnValue);
    return returnValue;
  }
}
