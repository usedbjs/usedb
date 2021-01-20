import { types, createModel, normalizeResponse } from '@usedb/core';

const Date = types.string;

const User = types.model('User', {
  userID: types.identifierNumber,
  userHandle: types.string,
  userFirstName: types.string,
  userLastName: types.string,
  userProfilePicture: types.string,
  userNumFollowers: types.number,
  userNumFollowing: types.number,
  userIsFollowed: types.boolean,
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
  channel: types.safeReference(Channel),
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
  post: types.safeReference(User),
});

const LikedPosts = types.model('LikedPosts', {
  plID: types.identifierNumber,
  plTimeLiked: Date,
  plUser: types.safeReference(User),
  post: types.safeReference(Post),
});

const LikedArticles = types.model('LikedArticles', {
  alId: types.identifierNumber,
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

const CommonResponseType = types.model('CommonResponseType', {
  success: types.boolean,
});

const models = [
  User,
  Channel,
  Article,
  Post,
  Topic,
  RSSSectionData,
  Repost,
  Group,
];

export const actions = {
  HomeFeedActionModel: types.model('HomeFeedActionModel', {
    success: types.boolean,
    data: types.model({
      content: types.array(
        types.union(
          {
            dispatcher: snapshot => {
              if (snapshot.articleID) {
                return Article;
              } else if (snapshot.repostID) {
                return Repost;
              }
              return Post;
            },
          },
          types.reference(Article),
          types.reference(Repost),
          types.reference(Post)
        )
      ),
    }),
  }),
};

const dbModel = createModel({ models, actions: [actions.HomeFeedActionModel] });
export const db = dbModel.create();
