import { normalizeResponseGenerator } from '../normalizeResponse';
import { DBModel } from './dummyStore';

describe('normalization', () => {
  let store: any;
  let normalizer: any;
  beforeEach(() => {
    store = DBModel.create();
    normalizer = normalizeResponseGenerator(store);
  });

  it('should add __typename and id using the mst model (Object)', () => {
    const dummyPostResponse = {
      id: 1,
      text: 'hello world',
      user: { id: 2, username: 'nishan' },
    };
    const data: any = normalizer(dummyPostResponse, store.models.Post);
    expect(data.__typename).toBe('Post');
    expect(data.id).toBe(1);
    expect(data.user.id).toBe(2);
    expect(data.user.__typename).toBe('User');

    const dummyUserResponse = {
      id: 2,
      username: 'nishan',
    };
    const user: any = normalizer(dummyUserResponse, store.models.User);

    expect(user.id).toBe(2);
    expect(user.__typename).toBe('User');
  });

  it('should add __typename and id based on the model (Array)', () => {
    const dummyResponse = [
      {
        id: 1,
        text: 'hello world',
        user: { id: 2, username: 'nishan' },
      },
      {
        id: 2,
        text: 'hello world 2',
        user: { id: 3, username: 'chirag' },
      },
    ];
    const data: any = normalizer(dummyResponse, store.models.Post);
    data.forEach((d: any, idx: any) => {
      expect(d.__typename).toBe('Post');
      expect(d.id).toBe(dummyResponse[idx].id);
      expect(d.user.id).toBe(dummyResponse[idx].user.id);
      expect(d.user.__typename).toBe('User');
    });
  });

  it('should handle empty responses', () => {
    const dummyResponse: any = [];

    const data: any = normalizer(dummyResponse, store.models.Post);
    expect(data).toEqual([]);

    const dummyResponse2: any = {};

    const data2: any = normalizer(dummyResponse2, store.models.Post);
    expect(data2).toEqual({});
  });

  it('should handle actions model responses', () => {
    let res = {
      data: [{ id: '1', text: 'nishan' }],
      pagination: { cursor: { id: 1 } },
    };

    const data: any = normalizer(res, store.actions.getPosts);

    expect(data.pagination).toEqual(res.pagination);
    expect(data.data[0].id).toEqual('1');
    expect(data.data[0].__typename).toEqual('Post');
  });
});
