import { QueryData } from './../query';
export interface Binding {
  perform: (query: QueryData) => Promise<any>;
  getAllCollections: () => Promise<any>;
}

export { default as RuntimeBinding } from './Runtime';
export { default as LocalStorageBinding } from './LocalStorage';
export { default as CloudStorageBinding } from './CloudStorage';
