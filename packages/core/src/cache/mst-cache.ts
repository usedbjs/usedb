import {
  types,
  IAnyModelType,
  IOptionalIType,
  IMapType,
  ValidOptionalValues,
  Instance,
} from 'mobx-state-tree';
import { QueryData } from '../query';
import { deflateHelper, mergeHelper, denormalizeHelper } from './deflateHelper';

const QUERY_CACHE_NAME = 'queryCache';
const DB_NAME = 'MSTCache';

const CacheModel = types
  .model(DB_NAME, {
    queryCache: types.optional(types.map(types.frozen()), {}),
  })
  .volatile((): {
    __promises: Map<string, Promise<unknown>>;
  } => {
    return {
      __promises: new Map(),
    };
  })
  .views(self => {
    return {
      denormalize(data: unknown) {
        return denormalizeHelper(self, data);
      },
    };
  })
  .actions(self => {
    return {
      __pushPromise(promise: Promise<{}>, queryKey: string) {
        self.__promises.set(queryKey, promise);
        const onSettled = () => self.__promises.delete(queryKey);
        promise.then(onSettled, onSettled);
      },
      __cacheResponse(key: string, response: unknown) {
        self[QUERY_CACHE_NAME].set(key, response);
      },
      merge(data: unknown) {
        return mergeHelper(self, data);
      },
      deflate(data: unknown) {
        return deflateHelper(self, data);
      },
      has(query: QueryData) {
        return self[QUERY_CACHE_NAME].has(query.queryKey);
      },
      get(query: QueryData) {
        return self[QUERY_CACHE_NAME].get(query.queryKey);
      },
      runInAction(callback: any) {
        callback();
      },
    };
  });

type ICreateModelParams = {
  models: { [key: string]: IAnyModelType };
  actions: { [key: string]: IAnyModelType };
};

const createModel = ({ models, actions }: ICreateModelParams) => {
  let modelStoreObject: {
    [key: string]: IOptionalIType<IMapType<IAnyModelType>, ValidOptionalValues>;
  } = {};

  Object.keys(models).forEach(key => {
    models[key].name = key;
    modelStoreObject[key] = types.optional(types.map(models[key]), {});
  });

  const StoreModel = CacheModel.props({
    ...modelStoreObject,
  })
    .volatile(() => {
      return {
        models,
        actions,
      };
    })
    .actions(self => {
      return {
        getTypeDef(typeName: string) {
          return self.models[typeName];
        },
        isRootType(typename: string) {
          if (self.models[typename]) return true;
          return false;
        },
        _save(name: string, data: any) {
          const model = self.models[name];
          const identifierAttribute = model.identifierAttribute;
          if (identifierAttribute) {
            const prevData = self[name].get(data[identifierAttribute]);
            if (prevData) {
              self[name].set(data[identifierAttribute], {
                ...prevData,
                ...data,
              });
            } else {
              self[name].set(data[identifierAttribute], data);
            }
          } else {
            console.error('Model needs an identifier attribute');
          }
        },
      };
    });

  return StoreModel;
};

export { createModel };

export type DBInstance = Instance<typeof CacheModel>;

export const getPaginationModel = (model: IAnyModelType) =>
  types.model('PaginationModel', {
    pagination: types.frozen(),
    data: types.array(model),
  });
