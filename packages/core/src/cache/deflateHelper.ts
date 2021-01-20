import { resolveIdentifier } from 'mobx-state-tree';

export function mergeHelper(store: any, data: any) {
  function merge(data: any): any {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(merge);

    const { __typename, id } = data;

    // convert values deeply first to MST objects as much as possible
    const snapshot: any = {};
    for (const key in data) {
      snapshot[key] = merge(data[key]);
    }

    // GQL object
    if (__typename) {
      const typeDef = store.getTypeDef(__typename);
      let instance = id !== undefined && resolveIdentifier(typeDef, store, id);
      if (instance) {
        // update existing object
        Object.assign(instance, snapshot);
      } else {
        instance = typeDef.create(snapshot);
        if (store.isRootType(__typename)) {
          store[__typename].set(id, snapshot);
        }
      }
      return instance;
    } else {
      return snapshot;
    }
  }

  return merge(data);
}

export function deflateHelper(store: any, data: any) {
  function deflate(data: any): any {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(deflate);

    const { __typename, id } = data;

    if (__typename && store.isRootType(__typename)) {
      // GQL object with root type, keep only __typename & id
      return { __typename, id };
    } else {
      // GQL object with non-root type, return object with all props deflated
      const snapshot: any = {};
      for (const key in data) {
        snapshot[key] = deflate(data[key]);
      }
      return snapshot;
    }
  }

  return deflate(data);
}
