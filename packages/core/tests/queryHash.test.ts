import QueryData from '../src/query/QueryData';

describe('query hash function', () => {
  it('should produce same hash value when query order is different', () => {
    const query1 = new QueryData('Post', 'findOne', {
      where: { id: '2', title: 'Post Title' },
    });

    const query2 = new QueryData('Post', 'findOne', {
      where: { title: 'Post Title', id: '2' },
    });

    expect(query1.getHash()).toEqual(query2.getHash());
  });
});
