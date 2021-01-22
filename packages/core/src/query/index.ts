import QueryData, { IFetchPolicy, getHash } from './QueryData';

export { QueryData, getHash };
export interface RootQueryBuilder {
  [key: string]: QueryBuilder;
}
export interface KeyPair {
  [key: string]: any;
}

export const GETTER_QUERIES = ['findOne', 'findMany', 'count'];
export const SETTER_QUERIES = ['update', 'updateMany', 'create', 'delete'];
export class QueryBuilder {
  collection: any;
  constructor(collection: string) {
    this.collection = collection;
  }
  create(obj: { data: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'create', obj, 'no-cache');
  }
  findOne(obj: { where: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'findOne', obj, 'cache-and-network');
  }
  findMany(obj: { where: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'findMany', obj, 'cache-and-network');
  }
  update(obj: {
    where: KeyPair;
    data: KeyPair;
    select?: Array<string>;
  }): QueryData {
    return new QueryData(this.collection, 'update', obj, 'no-cache');
  }
  updateMany(obj: {
    where: KeyPair;
    data: KeyPair;
    select?: Array<string>;
  }): QueryData {
    return new QueryData(this.collection, 'updateMany', obj, 'no-cache');
  }
  delete(obj: { where: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'delete', obj, 'no-cache');
  }
  deleteMany(obj: { where: KeyPair }): QueryData {
    return new QueryData(this.collection, 'deleteMany', obj, 'no-cache');
  }
  count(obj: { where: KeyPair }): QueryData {
    return new QueryData(this.collection, 'count', obj, 'cache-and-network');
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
  fetchPolicy: IFetchPolicy;
  normalizer?: any;
  queryKey?: string;
  append?: boolean;
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
          config?.fetchPolicy,
          config?.queryKey
        );
      };
    },
  }
);
