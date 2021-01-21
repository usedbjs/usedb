import { QueryData, Binding } from '@usedb/core';
import { actions, db } from './dbConfig';
import { homeFeedTransformer, postTransformer } from './transformers';
const artificialDelay = (fn: any) => setTimeout(fn, 1000);

export const articleTransformer = (data: any) => {
  let d;
  if (Array.isArray(data)) {
    d = [];
    return data.forEach(articleTransformer);
  } else {
    return {
      ...data,
      channel: {
        channelID: data.channelID,
        channelName: data.channelName,
        channelIcon: data.channelIcon,
        channelLogo: data.channelLogo,
        channelTrustType: data.channelTrustType,
      },
    };
  }
};

const dummyHomeFeedRes = {
  success: true,
  data: {
    content: [
      {
        articleID: 0,
        articleTimePublished: '2021-01-20T10:35:39.886Z',
        articleImage: 'string',
        articleHeadline: 'string',
        articleIntroText: 'string',
        articleLink: 'string',
        articleNumLikes: 0,
        articleNumComments: 0,
        articleNumShares: 0,
        articleIsLiked: true,
        articleIsSaved: true,
        channelID: 0,
        channelName: 'string',
        channelIcon: 'string',
        channelLogo: 'string',
        channelTrustType: 0,
      },
      {
        postID: 0,
        postCaption: 'string',
        postTimePublished: '2021-01-20T10:35:39.886Z',
        postNumLikes: 0,
        postNumComments: 0,
        postNumShares: 0,
        postIsLiked: true,
        postIsSaved: true,
        postUserID: 0,
        postUserFirstName: 'string',
        postUserLastName: 'string',
        postUserProfilePicture: 'string',
        articleID: 0,
        articleTimePublished: '2021-01-20T10:35:39.886Z',
        articleImage: 'string',
        articleHeadline: 'string',
        articleIntroText: 'string',
        articleLink: 'string',
        articleNumLikes: 0,
        articleNumComments: 0,
        articleNumShares: 0,
        articleIsLiked: true,
        articleIsSaved: true,
        channelID: 0,
        channelName: 'string',
        channelIcon: 'string',
        channelLogo: 'string',
        channelTrustType: 0,
      },
      {
        repostID: 0,
        repostCaption: 'string',
        repostTimePublished: '2021-01-20T10:35:39.886Z',
        repostNumLikes: 0,
        repostNumComments: 0,
        repostNumShares: 0,
        repostIsLiked: true,
        repostIsSaved: true,
        repostUserID: 0,
        repostUserFirstName: 'string',
        repostUserLastName: 'string',
        repostUserProfilePicture: 'string',
        postID: 0,
        postCaption: 'string',
        postTimePublished: '2021-01-20T10:35:39.886Z',
        postNumLikes: 0,
        postNumComments: 0,
        postNumShares: 0,
        postIsLiked: true,
        postIsSaved: true,
        postUserID: 0,
        postUserFirstName: 'string',
        postUserLastName: 'string',
        postUserProfilePicture: 'string',
        articleID: 0,
        articleTimePublished: '2021-01-20T10:35:39.886Z',
        articleImage: 'string',
        articleHeadline: 'string',
        articleIntroText: 'string',
        articleLink: 'string',
        articleNumLikes: 0,
        articleNumComments: 0,
        articleNumShares: 0,
        articleIsLiked: true,
        articleIsSaved: true,
        channelID: 0,
        channelName: 'string',
        channelIcon: 'string',
        channelLogo: 'string',
        channelTrustType: 0,
      },
      {
        alID: 0,
        alTimeLiked: '2021-01-20T10:35:39.886Z',
        alUserID: 0,
        alUserFirstName: 'string',
        alUserLastName: 'string',
        alUserProfilePicture: 'string',
        articleID: 0,
        articleTimePublished: '2021-01-20T10:35:39.886Z',
        articleImage: 'string',
        articleHeadline: 'string',
        articleIntroText: 'string',
        articleLink: 'string',
        articleNumLikes: 0,
        articleNumComments: 0,
        articleNumShares: 0,
        articleIsLiked: true,
        articleIsSaved: true,
        channelID: 0,
        channelName: 'string',
        channelIcon: 'string',
        channelLogo: 'string',
        channelTrustType: 0,
      },
      {
        plID: 0,
        plTimeLiked: '2021-01-20T10:35:39.886Z',
        plUserID: 0,
        plUserFirstName: 'string',
        plUserLastName: 'string',
        plUserProfilePicture: 'string',
        postID: 0,
        postCaption: 'string',
        postTimePublished: '2021-01-20T10:35:39.886Z',
        postNumLikes: 0,
        postNumComments: 0,
        postNumShares: 0,
        postIsLiked: true,
        postIsSaved: true,
        postUserID: 0,
        postUserFirstName: 'string',
        postUserLastName: 'string',
        postUserProfilePicture: 'string',
        articleID: 0,
        articleTimePublished: '2021-01-20T10:35:39.886Z',
        articleImage: 'string',
        articleHeadline: 'string',
        articleIntroText: 'string',
        articleLink: 'string',
        articleNumLikes: 0,
        articleNumComments: 0,
        articleNumShares: 0,
        articleIsLiked: true,
        articleIsSaved: true,
        channelID: 0,
        channelName: 'string',
        channelIcon: 'string',
        channelLogo: 'string',
        channelTrustType: 0,
      },
    ],
    offsets: {
      articleOffsets: {},
      postsOffset: 0,
      repostsOffset: 0,
      articleLikesOffset: 0,
      postLikesOffset: 0,
    },
  },
};

const dummyCreatePostResponse = {
  success: true,
  data: {
    postID: 23,
    postCaption: 'string',
    postTimePublished: '2021-01-20T13:19:10.334Z',
    postNumLikes: 0,
    postNumComments: 0,
    postNumShares: 0,
    postIsLiked: true,
    postIsSaved: true,
    postUserID: 0,
    postUserFirstName: 'string',
    postUserLastName: 'string',
    postUserProfilePicture: 'string',
    articleID: 0,
    articleTimePublished: '2021-01-20T13:19:10.334Z',
    articleImage: 'string',
    articleHeadline: 'string',
    articleIntroText: 'string',
    articleLink: 'string',
    articleNumLikes: 0,
    articleNumComments: 0,
    articleNumShares: 0,
    articleIsLiked: true,
    articleIsSaved: true,
    channelID: 0,
    channelName: 'string',
    channelIcon: 'string',
    channelLogo: 'string',
    channelTrustType: 0,
  },
};
const channelsDummy = {
  success: true,
  data: [
    {
      channelID: 122,
      channelIcon: 'ef',
      channelLogo: 'd',
      channelName: 'name',
      channelTrustType: 2,
    },
  ],
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
      case 'getHomeFeed':
        // const res = homeFeedTransformer(dummyHomeFeedRes);
        // console.log('res ', res);
        return homeFeedTransformer(dummyHomeFeedRes);
      case 'getChannels':
        return channelsDummy;
      case 'createPost':
        return {
          success: true,
          data: postTransformer(dummyCreatePostResponse.data),
        };
      default:
        break;
    }
    return { meta: {}, data: returnValue };
  }
}
