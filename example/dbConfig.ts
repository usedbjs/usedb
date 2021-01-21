import { types, createModel } from '@usedb/core';

const Date = types.string;

const User = types.model('User', {
  userID: types.identifierNumber,
  userHandle: types.maybe(types.string),
  userFirstName: types.maybe(types.string),
  userLastName: types.maybe(types.string),
  userProfilePicture: types.maybe(types.string),
  userNumFollowers: types.maybe(types.number),
  userNumFollowing: types.maybe(types.number),
  userIsFollowed: types.maybe(types.boolean),
});

const Channel = types.model('Channel', {
  channelID: types.identifierNumber,
  channelName: types.string,
  channelIcon: types.string,
  channelLogo: types.string,
  channelTrustType: types.number,
});

const Article = types.model('Article', {
  articleID: types.identifierNumber,
  articleTimePublished: Date,
  articleImage: types.maybeNull(types.string),
  articleHeadline: types.string,
  articleIntroText: types.string,
  articleLink: types.string,
  articleNumLikes: types.number,
  articleNumComments: types.number,
  articleNumShares: types.number,
  articleIsLiked: types.boolean,
  articleIsSaved: types.boolean,
  channel: types.safeReference(Channel),
});

const Post = types.model('Post', {
  postID: types.identifierNumber,
  postCaption: types.string,
  postTimePublished: Date,
  postNumLikes: types.number,
  postNumComments: types.number,
  postNumShares: types.number,
  postIsLiked: types.boolean,
  postIsSaved: types.boolean,
  postUser: types.safeReference(User),
  article: types.safeReference(Article),
});

const Topic = types.model('Topic', {
  topicID: types.identifierNumber,
  topicName: types.string,
  topicColor: types.string,
});

const RSSSectionData = types.model('RSSSectionData', {
  rssSectionID: types.identifierNumber,
  rssSectionName: types.number,
});

const Repost = types.model('Repost', {
  repostID: types.identifierNumber,
  repostCaption: types.string,
  repostTimePublished: Date,
  repostNumLikes: types.number,
  repostNumComments: types.number,
  repostNumShares: types.number,
  repostIsLiked: types.boolean,
  repostIsSaved: types.boolean,
  repostUser: types.safeReference(User),
  post: types.safeReference(Post),
});

const LikedPosts = types.model('LikedPosts', {
  plID: types.identifierNumber,
  plTimeLiked: Date,
  plUser: types.safeReference(User),
  post: types.safeReference(Post),
});

const LikedArticles = types.model('LikedArticles', {
  alID: types.identifierNumber,
  alTimeLiked: Date,
  alUser: types.safeReference(User),
  article: types.safeReference(Article),
});

const PostComment = types.model('PostComment', {
  commentID: types.identifierNumber,
  commentPostID: types.number,
  commentText: types.string,
  commentTimePosted: Date,
  commentNumReplies: types.number,
  commentUser: types.safeReference(User),
});

const RepostComment = types.model('RepostComment', {
  rcID: types.identifierNumber,
  rcRepostID: types.number,
  rcText: types.string,
  rcTimePosted: Date,
  rcNumReplies: types.number,
  rcUserID: types.safeReference(User),
});

const ArticleComment = types.model('ArticleComment', {
  acID: types.identifierNumber,
  acArticleID: types.number,
  acText: types.string,
  acTimePosted: Date,
  acNumReplies: types.number,
  acUser: types.safeReference(User),
});

const Group = types.model('Group', {
  groupID: types.identifierNumber,
  groupName: types.string,
  groupIsPrivate: types.boolean,
  groupNumMembers: types.number,
  groupNumJoinRequests: types.number,
  groupNumPosts: types.number,
  groupImage: types.string,
  groupIsJoined: types.boolean,
});

const models = [
  User,
  Channel,
  Article,
  Post,
  Repost,
  LikedArticles,
  LikedPosts,
  Topic,
  RSSSectionData,
  Group,
];

export const actions = {
  getHomeFeed: types.model('getHomeFeed', {
    success: types.boolean,
    data: types.model({
      content: types.array(
        types.union(
          {
            dispatcher: snapshot => {
              if (snapshot.repostID !== undefined) {
                return Repost;
              } else if (snapshot.alID !== undefined) {
                return LikedArticles;
              } else if (snapshot.plID !== undefined) {
                return LikedPosts;
              } else if (snapshot.postID !== undefined) {
                return Post;
              }
              return Article;
            },
          },
          types.reference(Article),
          types.reference(Repost),
          types.reference(Post),
          types.reference(LikedArticles),
          types.reference(LikedPosts)
        )
      ),
    }),
  }),
  getChannels: types.model('getChannels', {
    success: types.boolean,
    data: types.array(types.safeReference(Channel)),
  }),
  createPost: types.model('createPost', {
    success: types.boolean,
    data: types.reference(Post),
  }),
};

const dbModel = createModel({
  models,
  actions: Object.keys(actions).map(key => actions[key]),
});

export const db = dbModel.create();
