import { types, createModel, onSnapshot } from '@usedb/core';

export const User = types.model({
  id: types.identifierNumber,
  username: types.string,
});

export const Post = types.model({
  id: types.identifierNumber,
  text: types.string,
  isLiked: types.boolean,
  user: types.safeReference(User),
});

export const Comment = types.model({
  id: types.identifierNumber,
  text: types.string,
  post: types.safeReference(Post),
});

const models = { User, Post, Comment };

export const actions = {
  getPosts: types.safeReference(Post),
  createPost: types.safeReference(Post),
};

const dbModel = createModel({
  models,
  actions,
});

export const db = dbModel.create();

onSnapshot(db, snapshot => {
  console.log('CACHE SNAPSHOT :: ', snapshot);
});
