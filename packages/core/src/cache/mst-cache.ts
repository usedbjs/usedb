//@ts-nocheck
import {
  IAnyModelType,
  IMapType,
  types,
  recordPatches,
  getSnapshot,
  destroy,
  getRoot,
} from 'mobx-state-tree';
import normalize from 'mobx-state-tree-normalizr';
import { Cache } from './index';
import { QueryData } from '../query';
import { exerimentalMSTViews } from './experimental-mst-views';

const RuntimeReference = types.model('RuntimeReference', {
  __type: types.string,
  id: types.string,
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

const QueryCacheType = types.union(
  RuntimeReferenceResolver,
  types.array(RuntimeReferenceResolver)
);

const QUERY_CACHE_NAME = 'queryCache';
const DB_NAME = 'MSTCache';

export type DBInstance = Cache;

type ICreateDBParams = { models: Array<IAnyModelType>; initialValue?: any };

type IModelKeyValue = {
  [key: string]: IAnyModelType;
};

type IModelMaps = {
  // Because Type 'IAnyType' is not assignable to type 'IAnyModelType'.ts(2322)
  [key: string]: IMapType<any>;
};

let modelKeyValue: IModelKeyValue = {};

const createDB = ({ models, initialValue }: ICreateDBParams) => {
  let modelMaps: IModelMaps = {};

  models.forEach(model => {
    modelKeyValue[model.name] = model;
    modelMaps[model.name] = types.map(model);
  });

  const DBModel = types
    .model(DB_NAME, {
      ...modelMaps,
      [QUERY_CACHE_NAME]: types.optional(types.map(QueryCacheType), {}),
    })
    .actions(self => {
      return {
        has(query: QueryData) {
          return self[QUERY_CACHE_NAME].has(query.queryKey);
        },
        get(query: QueryData) {
          return self[QUERY_CACHE_NAME].get(query.queryKey);
        },
        put(query: QueryData, data: any) {
          const model = modelKeyValue[query.collection];

          const normalizedResponse = self._populate({ data, model });

          // Getter queries add to the cache
          if (query.fetchPolicy === 'cache-and-network') {
            self[QUERY_CACHE_NAME].set(query.queryKey, normalizedResponse);
          }
          console.log('snapshot ', getSnapshot(self));
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
      };
    })
    .views(exerimentalMSTViews);

  const db = DBModel.create(initialValue);
  return db;
};

const normalizeResponse = (data: any, model: IAnyModelType) => {
  let mstModel: any = model;
  if (Array.isArray(data)) {
    mstModel = [model];
  }
  const result = normalize(data, mstModel);
  return result;
};

export { createDB };
