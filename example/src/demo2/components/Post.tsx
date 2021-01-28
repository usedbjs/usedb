import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { db } from '@usedb/core';
import { useDB } from '@usedb/react';

export const PostList = observer(function PostList() {
  const take = 5;
  const [skip, setSkip] = React.useState(0);

  const { data: posts, status, query } = useDB(
    db.Post.findMany({ skip, take })
  );

  if (status === 'loading') {
    return <div>loading...</div>;
  } else if (posts) {
    const total = posts.pagination.total;

    return (
      <div>
        <button onClick={query.refetch}>Refetch</button>
        {posts.data.map(post => {
          return (
            <div key={post.id}>
              {post.caption}
              <div>
                <DeletePost postId={post.id}></DeletePost>
                <UpdatePost post={post}></UpdatePost>
              </div>
            </div>
          );
        })}
        <Pagination
          skip={skip}
          take={take}
          total={total}
          onSkipChange={setSkip}
        />
      </div>
    );
  }

  return null;
});

const Pagination = ({ skip, take, total, onSkipChange }: any) => {
  const totalPages = Math.ceil(total / take);

  const currentPage = Math.ceil(skip / take);

  const buttonStyle = page =>
    page === currentPage ? { backgroundColor: 'blue', color: 'white' } : {};

  const onPageSelect = page => {
    onSkipChange(page * take);
  };

  const onNext = () => {
    onSkipChange(skip + take);
  };

  const onPrev = () => {
    onSkipChange(skip - take);
  };

  return (
    <div>
      <button disabled={skip === 0} onClick={onPrev}>
        Prev
      </button>
      {Array.from(Array(totalPages).keys()).map(key => {
        return (
          <button
            style={buttonStyle(key)}
            key={key}
            onClick={() => onPageSelect(key)}
          >
            {key + 1}
          </button>
        );
      })}
      <button disabled={skip + take >= total} onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export const CreatePost = observer(function CreatePost() {
  const [value, setValue] = React.useState('');
  const { status, setQuery } = useDB();

  const handleCreatePost = e => {
    e.preventDefault();
    setQuery(
      db.Post.create({
        data: { caption: value },
      })
    );
  };

  return (
    <div>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <button type="submit" disabled={status === 'loading'}>
          Create post
        </button>
      </form>
    </div>
  );
});

export const DeletePost = observer(function DeletePost({
  postId,
}: {
  postId: string;
}) {
  const { status, setQuery } = useDB();

  const handleDeletePost = e => {
    e.preventDefault();
    setQuery(db.Post.delete({ where: { id: postId } }));
  };

  return <button onClick={handleDeletePost}>Delete</button>;
});

export const UpdatePost = observer(function UpdatePost({ post }: any) {
  const [value, setValue] = React.useState(post.caption);
  const [showUpdateForm, setShowUpdateForm] = React.useState(false);
  const { status, setQuery } = useDB();

  const handleCreatePost = e => {
    e.preventDefault();
    setQuery(
      db.Post.update({
        data: { caption: value },
        where: { id: post.id },
      })
    );

    setShowUpdateForm(false);
  };

  return (
    <div>
      <button onClick={() => setShowUpdateForm(!showUpdateForm)}>Edit</button>
      {showUpdateForm ? (
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            onChange={e => setValue(e.target.value)}
            value={value}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            onClick={handleCreatePost}
          >
            Update post
          </button>
        </form>
      ) : null}
    </div>
  );
});
