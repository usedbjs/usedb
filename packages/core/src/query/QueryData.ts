import { md5 } from './../utils/md5';
export default class QueryData {
  collection: string;
  operation: string;
  payload: any;
  constructor(collection: string, operation: string, payload: any) {
    this.collection = collection;
    this.operation = operation;
    this.payload = payload;
  }
  getHash() {
    return md5(JSON.stringify(this));
  }
}
