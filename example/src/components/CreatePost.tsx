import { db } from '@usedb/core';
import { useDBv2 } from '@usedb/react';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { db as cacheDB } from '../../dbConfig';

export const CreatePost = observer(function CreatePost() {
  const dummyNewId = React.useRef(Math.random());

  const [value, setValue] = React.useState('');
  const { data, error, status, setQuery } = useDBv2();

  const handleCreatePost = () => {
    setQuery(
      db.actions.createPost({
        params: { text: value },
        fetchPolicy: 'no-cache',
      })
    );
  };

  React.useEffect(() => {
    if (status === 'loading') {
      // cacheDB._save("queryCache", {})
      // refetchMap.get('getPosts')();
      // refetchCallbacks.get()
      cacheDB.runInAction(() => {
        const currentUser = cacheDB.User.get(1);
        cacheDB.Post.set(dummyNewId.current, {
          id: dummyNewId.current,
          text: value,
          isLiked: false,
          user: currentUser,
        });
        const currentCache = cacheDB.queryCache.get('posts');
        const newCache = [
          { id: dummyNewId.current, __typename: 'Post' },
          ...currentCache,
        ];
        cacheDB.queryCache.set('posts', newCache);
      });
    }
    // Mutate cache
    if (status === 'success') {
      // cacheDB._save("queryCache", {})
      // refetchMap.get('getPosts')();
      // refetchCallbacks.get()
      cacheDB.runInAction(() => {
        const currentCache = cacheDB.queryCache.get('posts');
        const newCache = [
          { id: data.id, __typename: 'Post' },
          ...currentCache,
        ].filter(d => d.id !== dummyNewId.current);

        cacheDB.Post.delete(dummyNewId.current);

        cacheDB.queryCache.set('posts', newCache);
      });
    }
  }, [status]);

  return (
    <div>
      <input
        type="text"
        onChange={e => setValue(e.target.value)}
        value={value}
      ></input>
      <button onClick={handleCreatePost} disabled={status === 'loading'}>
        Create post
      </button>
    </div>
  );
});
