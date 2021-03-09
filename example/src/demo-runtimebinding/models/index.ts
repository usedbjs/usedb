import { types, createModel, onSnapshot, getSnapshot } from '@usedb/core';

export const Post = types.model({
  id: types.identifierNumber,
  caption: types.string,
});

const models = {
  Post,
};

const DBModel = createModel({
  models,
  actions: {},
});

export const db = DBModel.create();

onSnapshot(db, () => {
  console.log('CACHE SNAPSHOT :: ', getSnapshot(db));
});
