import { types, createModel } from '../../index';

const User = types.model({
  id: types.identifierNumber,
  username: types.string,
  name: types.maybe(types.string),
});

const Post = types.model({
  id: types.identifierNumber,
  text: types.string,
  isLiked: types.boolean,
  user: types.safeReference(User),
  excerpt: types.maybe(types.string),
});

const Comment = types.model({
  id: types.identifierNumber,
  text: types.string,
  post: types.safeReference(Post),
});

const models = { User, Post, Comment };

export const actions = {
  getPosts: types.model({
    pagination: types.frozen(),
    data: types.array(types.safeReference(Post)),
  }),
  createPost: types.safeReference(Post),
};

export const DBModel = createModel({
  models,
  actions,
});
