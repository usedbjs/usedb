import { QueryData } from './../query';
export class Cache {
  private data: Map<string, any>;
  constructor() {
    this.data = new Map();
  }
  has(query: QueryData) {
    return this.data.get(query.getHash()) ? true : false;
  }
  get(query: QueryData) {
    return this.data.get(query.getHash());
  }
  put(query: QueryData, data: any) {
    this.data.set(query.getHash(), data);
  }
  forget(query: QueryData) {
    this.data.delete(query.getHash());
  }
  flush() {
    this.data = new Map();
  }
}

export * from './mst-cache';
