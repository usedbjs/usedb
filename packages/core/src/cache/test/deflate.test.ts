import { normalizeResponseGenerator } from '../normalizeResponse';
import { DBModel } from './dummyStore';

describe('deflate helper', () => {
  let store: any;
  let normalizer: any;
  beforeEach(() => {
    store = DBModel.create();
    normalizer = normalizeResponseGenerator(store);
  });

  it('should return deflated data i.e. id, __typename for rootType', () => {
    const dummyPostResponse = {
      id: 1,
      text: 'hello world',
      isLiked: false,
      user: { id: 2, username: 'nishan', name: 'nishan b' },
    };
    const data: any = normalizer(dummyPostResponse, store.models.Post);

    const deflatedData = store.deflate(data);
    expect(deflatedData).toEqual({ id: 1, __typename: 'Post' });
  });
});
