import QueryData from './QueryData';

export { QueryData };
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
    return new QueryData(this.collection, 'create', obj);
  }
  findOne(obj: { where: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'findOne', obj);
  }
  findMany(obj: { where: KeyPair; select?: Array<string> }): QueryData {
    return new QueryData(this.collection, 'findMany', obj);
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

export const db: RootQueryBuilder = new Proxy(
  {},
  {
    get: (_obj, prop: string) => {
      return new QueryBuilder(prop);
    },
  }
);
