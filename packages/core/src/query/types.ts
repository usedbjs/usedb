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
