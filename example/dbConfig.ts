import { types, createDB } from '@usedb/core';
const POST_COLLECTION_NAME = 'Post';

const Post = types.model(POST_COLLECTION_NAME, {
  id: types.identifier,
  title: types.string,
});

export const cacheDB = createDB({ models: [Post], initialValue: {} });
