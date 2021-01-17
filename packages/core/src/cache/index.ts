import { QueryData } from './../query';
export class Cache {
  private data: Map<string, any>;
  constructor() {
    this.data = new Map();
  }
  has(query: QueryData) {
    return this.data.get(query.queryKey) ? true : false;
  }
  get(query: QueryData) {
    return this.data.get(query.queryKey);
  }
  put(query: QueryData, data: any) {
    this.data.set(query.queryKey, data);
  }
  forget(query: QueryData) {
    this.data.delete(query.queryKey);
  }
  flush() {
    this.data = new Map();
  }
}

export * from './mst-cache';
