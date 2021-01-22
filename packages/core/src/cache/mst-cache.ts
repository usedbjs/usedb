//@ts-nocheck
import {
  IAnyModelType,
  IMapType,
  types,
  recordPatches,
  getSnapshot,
  destroy,
  getRoot,
  isModelType,
  getEnv,
} from 'mobx-state-tree';
import normalize from 'mobx-state-tree-normalizr';
import { Cache } from './index';
import { QueryData } from '../query';
import { exerimentalMSTViews } from './experimental-mst-views';
import { deflateHelper, mergeHelper, denormalizeHelper } from './deflateHelper';
import { normalizeResponseGenerator } from './normalizeResponse';

export const RuntimeReference = types.model('RuntimeReference', {
  __type: types.string,
  id: types.frozen(),
});

const RuntimeReferenceResolver = types.safeReference(RuntimeReference, {
  set: (value, parent: any) => {
    return value.__type + '_' + value.id;
  },
  get(identifier /* string */, parent: any /*Store*/) {
    const rootStore = getRoot(parent);
    const [type, id] = identifier.split('_');
    return rootStore[type].get(id) || null;
  },
});

const QueryCacheType = types.model('QueryCache', {
  data: types.optional(types.map(types.frozen()), {}),
});

const QUERY_CACHE_NAME = 'queryCache';
const DB_NAME = 'MSTCache';

export type DBInstance = Cache;

type ICreateDBParams = {
  models: Array<IAnyModelType>;
  actions: Array<IAnyModelType>;
};

type IModelStoreObject = {
  // Because Type 'IAnyType' is not assignable to type 'IAnyModelType'.ts(2322)
  [key: string]: IMapType<any>;
};

const createModel = ({ models, actions }: ICreateModelParams) => {
  let modelStoreObject: IModelStoreObject = {};

  Object.keys(models).forEach(key => {
    models[key].name = key;
    modelStoreObject[key] = types.optional(types.map(models[key]), {});
  });

  const DBModel = types
    .model(DB_NAME, {
      ...modelStoreObject,
      [QUERY_CACHE_NAME]: types.optional(types.map(types.frozen()), {}),
    })
    .volatile((self): {
      ssr: boolean;
      __promises: Map<string, Promise<unknown>>;
      __afterInit: boolean;
    } => {
      const {
        ssr = false,
      }: {
        ssr: boolean;
      } = getEnv(self);
      return {
        ssr,
        __promises: new Map(),
        __afterInit: false,
        models,
        actions,
      };
    })
    .views(self => {
      return {
        denormalize(data) {
          return denormalizeHelper(self, data);
        },
      };
    })
    .actions(self => {
      let normalizeResponse = normalizeResponseGenerator(self);
      return {
        __pushPromise(promise: Promise<{}>, queryKey: string) {
          self.__promises.set(queryKey, promise);
          const onSettled = () => self.__promises.delete(queryKey);
          promise.then(onSettled, onSettled);
        },
        __cacheResponse(key: string, response: any) {
          self[QUERY_CACHE_NAME].set(key, response);
        },
        getTypeDef(typeName: string) {
          return self.models[typeName];
        },
        merge(data) {
          return mergeHelper(self, data);
        },
        deflate(data) {
          return deflateHelper(self, data);
        },
        isRootType(typename) {
          if (self.models[typename]) return true;
        },
        has(query: QueryData) {
          return self[QUERY_CACHE_NAME].has(query.queryKey);
        },
        get(query: QueryData) {
          return self[QUERY_CACHE_NAME].get(query.queryKey);
        },
        _save(name: string, data: any) {
          const model = self.models[name];
          const identifierAttribute = model.identifierAttribute;

          const prevData = self[name].get(data[identifierAttribute]);
          if (prevData) {
            self[name].set(data[identifierAttribute], { ...prevData, ...data });
          } else {
            self[name].set(data[identifierAttribute], data);
          }
        },
        runInAction(callback: any) {
          callback();
        },
      };
    })
    .views(exerimentalMSTViews);

  return DBModel;
};

export { createModel };
