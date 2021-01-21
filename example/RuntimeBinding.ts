import { QueryData, Binding } from '@usedb/core';
import { posts, users } from './data/mock';
const artificialDelay = (fn: any) => setTimeout(fn, 1000);

const getPosts = ({ limit, offset }) => {
  return posts.slice(offset, offset + limit);
};

const createPost = ({ text }) => {
  const newPost = {
    id: Math.random(),
    text,
    isLiked: false,
    user: users[0],
  };
  posts.unshift(newPost);
  return newPost;
};

const toggleLikePost = ({ id }) => {
  const post = posts.find(p => p.id === id);
  post?.isLiked = !post?.isLiked;
  return post;
};

export class RuntimeBinding implements Binding {
  db: any = [];
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
    switch (operation) {
      case 'getPosts':
        return getPosts({ offset: payload.offset, limit: payload.limit });

      case 'createPost':
        return createPost(payload);

      case 'toggleLikePost':
        return toggleLikePost(payload);

      case 'deletePost':
        return { success: true };

      case 'findOne':
        return users.find(d => payload.where.id === d.id);

      case 'update':
        const user = users.find(d => d.id === payload.where.id);
        user?.username = payload.data.username;
        return user;
      default:
        break;
    }
    return { meta: {}, data: returnValue };
  }
}
