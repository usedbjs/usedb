import { normalizeResponse, QueryData, Binding } from '@usedb/core';
import { actions, db } from './dbConfig';
const artificialDelay = (fn: any) => setTimeout(fn, 1000);

const dummyHomeRes = {
  success: true,
  data: {
    id: '3',
    content: [
      {
        postID: 1,
        postCaption: 'hi',
        postIsLiked: true,
        postIsSaved: true,
        postNumComments: 2,
        postNumLikes: 3,
        postNumShares: 3,
        postTimePublished: 'fefe',
        article: {
          articleHeadline: 'ef',
          articleID: 2,
          articleIntroText: '3',
          articleIsLiked: true,
          articleIsSaved: true,
          articleLink: 'eefegg',
          articleNumComments: 3,
          articleNumLikes: 3,
          articleNumShares: 3,
          articleTimePublished: 'fefe',
          articleImage: 'efef',
        },
        channel: {
          channelID: 3,
          channelIcon: 'ef',
          channelLogo: 'd',
          channelName: 'name',
          channelTrustType: 2,
        },
        postUser: {
          userFirstName: 'd',
          userHandle: 'wdwd',
          userID: 3,
          userIsFollowed: false,
          userLastName: 'efef',
          userNumFollowers: 4,
          userNumFollowing: 3,
          userProfilePicture: 'def',
        },
      },
    ],
  },
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
    const { collection, operation, payload } = query;
    let returnValue: any;
    switch (operation) {
      case 'HomeFeedActionModel':
        return dummyHomeRes;
      default:
        break;
    }
    return { meta: {}, data: returnValue };
  }
}
