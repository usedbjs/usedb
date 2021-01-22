import { action, observable, makeObservable, computed } from 'mobx';
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

const isServer: boolean = typeof window === 'undefined';

export class Query<T = unknown> implements PromiseLike<T> {
  status: 'success' | 'error' | 'loading' | 'idle' = 'idle';
  error: any = undefined;
  response: any = undefined;

  public query: QueryData;
  private connection: Connection;
  public promise!: Promise<T>;
  private fetchPolicy: FetchPolicy;
  private queryKey: string;
  private store: any;

  constructor(
    connection: Connection,
    query: QueryData,
    public options: QueryOptions = {}
  ) {
    makeObservable(this, {
      status: observable,
      data: computed,
      error: observable,
      response: observable,
    });

    this.query = query;
    this.queryKey = this.query.queryKey;
    this.connection = connection;
    this.store = this.connection.cache;

    let fetchPolicy = options.fetchPolicy || 'cache-and-network';
    if (
      this.store.ssr &&
      !this.options.noSsr &&
      (isServer || !this.store.__afterInit)
    ) {
      fetchPolicy = 'cache-first';
    }
    this.fetchPolicy = fetchPolicy;

    if (this.store.ssr && this.options.noSsr && isServer) {
      this.promise = Promise.resolve() as any;
      return;
    }

    const inCache = false || this.store.queryCache.has(this.queryKey);
    switch (this.fetchPolicy) {
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

  clearData = (): void => {
    action(() => {
      if (this.connection.cache.has(this.query)) {
        this.connection.cache.forget(this.query);
      }
      this.response = undefined;
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
    if (this.store.queryCache.has(this.query.queryKey)) {
      //@ts-ignore
      return this.store.denormalize(this.query?.queryKey);
    }

    return this.response;
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
        const returnedData = this.store.put(this.query, data);
        if (!this.store.has(this.query)) {
          this.response = returnedData;
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
