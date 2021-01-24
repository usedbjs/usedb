import { QueryData, Binding } from '@usedb/core';
import { filter, findIndex } from 'lodash';
import { posts, users } from './data/mock';
const artificialDelay = (fn: any) => setTimeout(fn, 1000);

export class RuntimeBinding implements Binding {
  db: any = {
    User: users,
  };

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
      artificialDelay(async () => {
        try {
          if (!query.operation) {
            reject('Invalid query');
          }
          let queryResponse = await this.processQuery(query);

          resolve(queryResponse);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private async processQuery(query: QueryData): Promise<any> {
    const { collection, operation, payload = {} } = query;
    let returnValue: any;
    console.log('QUERY :: ', query);
    switch (operation) {
      case 'create': {
        returnValue = this.handleCreate(collection, payload);
        break;
      }
      case 'findMany': {
        if (payload.hasOwnProperty('where')) {
          returnValue = filter(this.db[collection], payload.where);
          const cursor = payload.cursor.id;
          const { take } = payload;
          const index = returnValue.findIndex(r => r.id === cursor);
          returnValue = returnValue.slice(index + 1, index + 1 + take);

          const nextCursor = this.db[collection][index + take]?.id;

          returnValue = {
            data: returnValue,
            pagination: {
              cursor: {
                id: nextCursor,
              },
              first: cursor === undefined,
              last: nextCursor === undefined,
            },
          };
        } else {
          returnValue = this.db[collection];
        }
        break;
      }

      case 'findOne': {
        returnValue = users[0];
        break;
      }

      case 'update': {
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
      }

      case 'delete': {
        if (payload.hasOwnProperty('where')) {
          let index = findIndex(this.db[collection], payload.where);
          if (index !== -1) {
            returnValue = this.db[collection][index];
            this.db[collection].splice(index, 1);
          }
        }
        return { success: true };
      }

      case 'getPosts': {
        const cursor = payload.cursor.id;
        const { take } = payload;
        const index = posts.findIndex(r => r.id === cursor);
        returnValue = posts.slice(index + 1, index + 1 + take);

        const nextCursor = posts[index + take]?.id;

        returnValue = {
          data: returnValue,
          pagination: {
            cursor: {
              id: nextCursor,
            },
            first: cursor === undefined,
            last: nextCursor === undefined,
          },
        };
        break;
      }

      case 'createPost': {
        returnValue = this.handleCreate('Post', payload);
        break;
      }

      default:
        break;
    }

    console.log('BINDING RESPONSE ::   ', returnValue);

    return returnValue;
  }

  handleCreate(collection, { data }) {
    if (!this.db[collection]) {
      this.db[collection] = [];
    }
    let returnValue;
    switch (collection) {
      case 'Post': {
        returnValue = {
          id: this.db[collection].length,
          text: data.text,
          isLiked: false,
          user: users[0],
        };

        this.db[collection].unshift(returnValue);
      }
    }

    return returnValue;
  }
}
