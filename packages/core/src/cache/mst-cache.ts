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

type IModelKeyValue = {
  [key: string]: IAnyModelType;
};

type IModelMaps = {
  // Because Type 'IAnyType' is not assignable to type 'IAnyModelType'.ts(2322)
  [key: string]: IMapType<any>;
};

let modelKeyValue: IModelKeyValue = {};

const createModel = ({ models, actions }: ICreateModelParams) => {
  let modelMaps: IModelMaps = {};
  let actionKeyValue: IModelMaps = {};

  models.forEach(model => {
    modelKeyValue[model.name] = model;
    modelMaps[model.name] = types.optional(types.map(model), {});
  });

  actions.forEach(action => {
    if (isModelType(action)) {
      actionKeyValue[action.name] = action;
    } else {
      actionKeyValue[action.name] = action.type;
    }
  });

  const DBModel = types
    .model(DB_NAME, {
      ...modelMaps,
      [QUERY_CACHE_NAME]: types.optional(types.map(types.frozen()), {}),
    })
    .views(self => {
      return {
        denormalize(key) {
          const cache = self[QUERY_CACHE_NAME].get(key);
          const dd = denormalizeHelper(self, cache);
          return dd;
          // return mergeHelper(self, data);
        },
      };
    })
    .actions(self => {
      let normalizeResponse = normalizeResponseGenerator(self);
      return {
        getTypeDef(typeName: string) {
          return modelKeyValue[typeName];
        },
        merge(data) {
          return mergeHelper(self, data);
        },
        deflate(data) {
          return deflateHelper(self, data);
        },
        isRootType(typename) {
          if (modelKeyValue[typename]) return true;
        },
        has(query: QueryData) {
          return self[QUERY_CACHE_NAME].has(query.queryKey);
        },
        get(query: QueryData) {
          return self[QUERY_CACHE_NAME].get(query.queryKey);
        },
        put(query: QueryData, payload: any) {
          let model;
          if (query.collection === 'actions') {
            model = actionKeyValue[query.operation];
            // Need a model to insert into the store
          } else {
            model = modelKeyValue[query.collection];
          }

          if (model) {
            const res = normalizeResponse(payload, model);
            const hydratedRes = self.merge(res);
            if (query.fetchPolicy === 'no-cache') {
              return hydratedRes;
            } else {
              self[QUERY_CACHE_NAME].set(query.queryKey, self.deflate(res));
              return self.get(query);
            }
          } else {
            return payload;
          }
        },
        _save(name: string, data: any) {
          const model = modelKeyValue[name];
          const identifierAttribute = model.identifierAttribute;

          const prevData = self[name].get(data[identifierAttribute]);
          if (prevData) {
            self[name].set(data[identifierAttribute], { ...prevData, ...data });
          } else {
            self[name].set(data[identifierAttribute], data);
          }
        },
        _populate({ data, model }: { data: any; model: any }) {
          const { entities, result } = normalizeResponse(data, model);
          for (let key in entities) {
            const modelData = entities[key];

            for (let id in modelData) {
              //@ts-ignore
              self._save(key, modelData[id]);
            }
          }

          let normalizedResponse: any;
          if (Array.isArray(result)) {
            normalizedResponse = result.map((id: any) => {
              return RuntimeReference.create({ id, __type: model.name });
            });
          } else {
            normalizedResponse = RuntimeReference.create({
              id: result,
              __type: model.name,
            });
          }

          return normalizedResponse;
        },
        update(name: string, payload: any) {
          const recorder = recordPatches(self);
          //@ts-ignore
          const model = modelKeyValue[name];
          self._populate({
            data: { id: payload.where.id, ...payload.data },
            model,
          });
          recorder.stop();
          return function undo() {
            recorder.undo();
          };
        },
        create(name: string, payload: any) {
          const recorder = recordPatches(self);
          //@ts-ignore
          const model = modelKeyValue[name];
          self._populate({
            data: payload.data,
            model,
          });
          recorder.stop();
          return function undo() {
            recorder.undo();
          };
        },
        delete(name: string, payload: any) {
          const recorder = recordPatches(self);
          //@ts-ignore
          const model = modelKeyValue[name];
          destroy(self[name].get(payload.where.id));
          recorder.stop();
          return function undo() {
            recorder.undo();
          };
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
