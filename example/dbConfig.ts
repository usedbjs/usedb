import { types, createDB } from '@usedb/core';
const POST_COLLECTION_NAME = 'Post';

const Author = types.model('Author', {
  id: types.identifier,
  name: types.string,
});

const Post = types.model(POST_COLLECTION_NAME, {
  id: types.identifier,
  title: types.string,
  author: types.safeReference(Author),
});

export const cacheDB = createDB({ models: [Post, Author], initialValue: {} });
