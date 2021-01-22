import { normalizeResponseGenerator } from '../normalizeResponse';
import { DBModel } from './dummyStore';

describe('merge helper', () => {
  let store: any;
  let normalizer: any;
  beforeEach(() => {
    store = DBModel.create();
    normalizer = normalizeResponseGenerator(store);
  });

  it('should merge data into store in a normalized form', () => {
    const dummyPostResponse = {
      id: 1,
      text: 'hello world',
      isLiked: false,
      user: { id: 2, username: 'nishan' },
    };
    const data: any = normalizer(dummyPostResponse, store.models.Post);
    store.merge(data);
    expect(store.User.get(2)).toEqual(dummyPostResponse.user);
    expect(store.Post.get(1)).toEqual(dummyPostResponse);
    expect(store.Post.get(1).user).toEqual(dummyPostResponse.user);
  });

  it('should not delete data when partial data is merged', () => {
    // Response 1
    const dummyPostResponse = {
      id: 1,
      text: 'hello world',
      isLiked: false,
      user: { id: 2, username: 'nishan', name: 'nishan b' },
    };
    const data: any = normalizer(dummyPostResponse, store.models.Post);
    store.merge(data);

    // Partial Post Response
    const postDetailRes = {
      id: 1,
      excerpt: 'this is an excerpt',
    };

    const data2: any = normalizer(postDetailRes, store.models.Post);
    store.merge(data2);
    expect(store.Post.get(1).user.id).toEqual(2);
    expect(store.Post.get(1).text).toEqual('hello world');
    expect(store.Post.get(1).excerpt).toEqual(postDetailRes.excerpt);
  });
});
