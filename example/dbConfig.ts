import { types, createModel, onSnapshot } from '@usedb/core';

const User = types.model('User', {
  id: types.identifierNumber,
  username: types.string,
});

const Post = types.model('Post', {
  id: types.identifierNumber,
  text: types.string,
  isLiked: types.boolean,
  user: types.safeReference(User),
});

const Comment = types.model('Comment', {
  id: types.identifierNumber,
  text: types.string,
  post: types.safeReference(Post),
});

const models = [User, Post, Comment];

export const actions = {
  getPosts: { name: 'getPosts', type: types.array(types.safeReference(Post)) },
  getChannels: types.model('getChannels', {
    success: types.boolean,
  }),
  createPost: { name: 'createPost', type: types.safeReference(Post) },
  toggleLikePost: { name: 'toggleLikePost', type: types.safeReference(Post) },
};

const dbModel = createModel({
  models,
  actions: Object.keys(actions).map(key => actions[key]),
});

export const db = dbModel.create();

onSnapshot(db, snapshot => {
  console.log({ snapshot });
});
