import { db } from '../index';

describe('handle paginated queries', () => {
  it('should not add cursor into queryKey', () => {
    const query = db.Post.findMany({ where: { id: 1 }, cursor: { id: 2 } });
    expect(query.queryKey.includes('cursor')).toBeFalsy();
  });
});
