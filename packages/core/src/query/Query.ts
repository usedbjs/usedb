//@ts-nocheck
import { action, observable, makeObservable, computed } from 'mobx';
import { normalizeResponseGenerator } from '../cache';
import { Connection } from '../connection';
import QueryData from './QueryData';

export type CaseHandlers<T, R> = {
  loading(): R;
  error(error: any): R;
  data(data: T): R;
};

export type FetchPolicy =
  | 'cache-first' // Use cache if available, avoid network request if possible
  | 'cache-only' // Use cache if available, or error
  | 'cache-and-network' // Use cache, but still send request and update cache in the background
  | 'network-only' // Skip cache, but cache the result
  | 'no-cache'; // Skip cache, and don't cache the response either

export interface QueryOptions {
  fetchPolicy?: FetchPolicy;
  noSsr?: boolean;
}

// const isServer: boolean = typeof window === 'undefined';

export class Query<T = unknown> implements PromiseLike<T> {
  status: 'success' | 'error' | 'loading' | 'idle' = 'idle';
  error: any = undefined;
  __response: any = undefined;

  public query: QueryData;
  private connection: Connection;
  public promise!: Promise<T>;
  private fetchPolicy: FetchPolicy;
  private queryKey: string;
  private normalizer: any;

  constructor(connection: Connection, query: QueryData) {
    makeObservable(this, {
      status: observable,
      data: computed,
      error: observable,
      __response: observable,
    });

    this.query = query;
    this.queryKey = this.query.queryKey;
    this.connection = connection;

    this.normalizer = normalizeResponseGenerator(this.store);

    const inCache = false;

    let fetchPolicy = this.query.fetchPolicy;

    switch (fetchPolicy) {
      case 'no-cache':
      case 'network-only':
        this.fetchResults();
        break;
      case 'cache-only':
        if (!inCache) {
          this.error = new Error(
            `No results for query ${this.query} found in cache, and policy is cache-only`
          );
          this.promise = Promise.reject(this.error);
        } else {
          this.useCachedResults();
        }
        break;
      case 'cache-and-network':
        this.fetchResults();
        break;
      case 'cache-first':
        if (inCache) {
          this.useCachedResults();
        } else {
          this.fetchResults();
        }
        break;
    }
  }

  get store() {
    return this.connection.cache;
  }

  clearData = (): void => {
    action(() => {
      if (this.store.queryCache.has(this.query.queryKey)) {
        this.store.queryCache.delete(this.query.queryKey);
      }
      this.__response = undefined;
    });
  };

  refetch = (): Promise<T> => {
    return Promise.resolve().then(
      action(() => {
        if (this.status !== 'loading') {
          this.fetchResults();
        }
        return this.promise;
      })
    );
  };

  get data() {
    let deflatedResponse;
    if (this.store.queryCache.has(this.query.queryKey)) {
      deflatedResponse = this.store.queryCache.get(this.query.queryKey);
    } else {
      deflatedResponse = this.__response;
    }

    return this.store.denormalize(deflatedResponse);
  }

  private fetchResults() {
    this.status = 'loading';
    let promise: Promise<T>;
    const existingPromise = this.store.__promises.get(this.queryKey);
    if (existingPromise) {
      promise = existingPromise as Promise<T>;
    } else {
      promise = this.connection.query(this.query);
      this.store.__pushPromise(promise, this.queryKey);
    }

    this.promise = promise;
    promise.then(
      action((data: any) => {
        this.status = 'success';
        this.error = false;
        let model;

        if (this.query.collection === 'actions') {
          model = this.store.actions[this.query.operation];
        } else {
          model = this.store.models[this.query.collection];
        }

        let updatedResponse;

        if (model) {
          // 1. Add id, __typename to response.
          const res = this.normalizer(data, model);
          // 2. Populate/Update the root store
          this.store.merge(res);

          const deflatedResponse = this.store.deflate(res);
          updatedResponse = deflatedResponse;
        } else {
          updatedResponse = data;
        }

        if (this.query.fetchPolicy !== 'no-cache') {
          // Put deflated data to the cache
          this.store.__cacheResponse(this.query.queryKey, updatedResponse);
        } else {
          this.__response = updatedResponse;
        }
      }),
      action((error: any) => {
        this.status = 'error';
        this.error = error;
      })
    );
  }

  private useCachedResults() {
    // this.data = this.store.merge(this.store.queryCache.get(this.queryKey));
    // this.promise = Promise.resolve(this.data!);
  }

  currentPromise() {
    return this.promise;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): PromiseLike<TResult1 | TResult2>;
  then(onfulfilled: any, onrejected: any) {
    return this.promise.then(
      d => {
        this.store.__runInStoreContext(() => onfulfilled(d));
      },
      e => {
        this.store.__runInStoreContext(() => onrejected(e));
      }
    );
  }
}
