import { FetchPolicy } from './types';
import QueryData, { getHash } from './QueryData';
export * from './types';
export { Query } from './Query';

export { QueryData, getHash };
export interface RootQueryBuilder {
  [key: string]: QueryBuilder;
}
export interface KeyPair {
  [key: string]: any;
}

type IAdditionalConfig = {
  queryKey?: string;
};

export const GETTER_QUERIES = ['findOne', 'findMany', 'count'];
export const SETTER_QUERIES = ['update', 'updateMany', 'create', 'delete'];
export class QueryBuilder {
  collection: any;
  constructor(collection: string) {
    this.collection = collection;
  }
  create(obj: { data: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'create', obj);
  }
  findOne(
    obj: { where: KeyPair; select?: Array<string> },
    config?: IAdditionalConfig
  ): QueryData {
    return new QueryData(this.collection, 'findOne', obj, config?.queryKey);
  }
  findMany(
    obj: { where: KeyPair; select?: Array<string> },
    config?: IAdditionalConfig
  ): QueryData {
    return new QueryData(this.collection, 'findMany', obj, config?.queryKey);
  }
  update(obj: {
    where: KeyPair;
    data: KeyPair;
    select?: Array<string>;
  }): QueryData {
    return new QueryData(this.collection, 'update', obj);
  }
  updateMany(obj: {
    where: KeyPair;
    data: KeyPair;
    select?: Array<string>;
  }): QueryData {
    return new QueryData(this.collection, 'updateMany', obj);
  }
  delete(obj: { where: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'delete', obj);
  }
  deleteMany(obj: { where: KeyPair }): QueryData {
    return new QueryData(this.collection, 'deleteMany', obj);
  }
  count(obj: { where: KeyPair }): QueryData {
    return new QueryData(this.collection, 'count', obj);
  }
}

export const db: any = new Proxy(
  {},
  {
    get: (_obj, prop: string) => {
      if (prop === 'actions') {
        return actionProxy;
      }

      return new QueryBuilder(prop);
    },
  }
);

type IActionParams = {
  params: any;
  fetchPolicy: FetchPolicy;
  queryKey?: string;
};

const actionProxy = new Proxy(
  {},
  {
    get: (_obj, actionName: string) => {
      return (config?: IActionParams): QueryData => {
        return new QueryData(
          'actions',
          actionName,
          config?.params,
          config?.queryKey
        );
      };
    },
  }
);
