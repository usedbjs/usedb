//@ts-ignore
import pick from 'lodash.pick';

const extractChannelFields = (data: any) => {
  return pick(data, [
    'channelID',
    'channelName',
    'channelIcon',
    'channelLogo',
    'channelTrustType',
  ]);
};

export const articleTransformer = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(articleTransformer);
  } else {
    const article = pick(data, [
      'articleID',
      'articleTimePublished',
      'articleImage',
      'articleHeadline',
      'articleIntroText',
      'articleLink',
      'articleNumLikes',
      'articleNumComments',
      'articleNumShares',
      'articleIsLiked',
      'articleIsSaved',
    ]);

    return {
      ...article,
      channel: extractChannelFields(data),
    };
  }
};

export const postTransformer = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(postTransformer);
  } else {
    const post = pick(data, [
      'postID',
      'postCaption',
      'postTimePublished',
      'postNumLikes',
      'postNumComments',
      'postNumShares',
      'postIsLiked',
      'postIsSaved',
    ]);

    return {
      ...post,
      postUser: {
        userID: data.postUserID,
        userFirstName: data.postUserLastName,
        userProfilePicture: data.postUserProfilePicture,
      },
      article: articleTransformer(data),
    };
  }
};

export const repostTransformer = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(repostTransformer);
  } else {
    const repost = pick(data, [
      'repostID',
      'repostCaption',
      'repostTimePublished',
      'repostNumLikes',
      'repostNumComments',
      'repostNumShares',
      'repostIsLiked',
      'repostIsSaved',
      'repostUserID',
      'repostUserFirstName',
      'repostUserLastName',
      'repostUserProfilePicture',
    ]);

    return {
      ...repost,
      repostUser: {
        userID: data.repostUserID,
        userFirstName: data.repostUserFirstName,
        userLastName: data.repostUserLastName,
        userProfilePicture: data.repostUserProfilePicture,
      },
      post: postTransformer(data),
    };
  }
};

export const articleLikedTransformer = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(articleLikedTransformer);
  } else {
    const al = pick(data, ['alID', 'alTimeLiked']);

    return {
      ...al,
      alUser: {
        userID: data.alUserID,
        userFirstName: data.alUserFirstName,
        userLastName: data.alUserLastName,
        userProfilePicture: data.alUserProfilePicture,
      },
      article: articleTransformer(data),
    };
  }
};

export const postLikedTransformer = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(postLikedTransformer);
  } else {
    const pl = pick(data, ['plID', 'plTimeLiked']);
    return {
      ...pl,
      plUser: {
        userID: data.plUserID,
        userFirstName: data.plUserFirstName,
        userLastName: data.plUserLastName,
        userProfilePicture: data.userProfilePicture,
      },
      post: postTransformer(data),
    };
  }
};

export const homeFeedTransformer = (data: any): any => {
  let d = data.data.content.map(c => {
    if (c.repostID !== undefined) {
      return repostTransformer(c);
    } else if (c.alID !== undefined) {
      return articleLikedTransformer(c);
    } else if (c.plID !== undefined) {
      return postLikedTransformer(c);
    } else if (c.postID !== undefined) {
      return postTransformer(c);
    } else if (c.articleID !== undefined) {
      return articleTransformer(c);
    }
  });

  return {
    ...data,
    data: {
      ...data.data,
      content: d,
    },
  };
};
