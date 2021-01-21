import * as React from 'react';
import { db } from '@usedb/core';
import { useDB } from '@usedb/react';

export const Test = function Test() {
  const { data: homeFeedData, error } = useDB(
    db.actions.getHomeFeed({ params: {} })
  );

  const { setQuery, data, status } = useDB();

  const handleCreatePost = () => {
    const data = {
      caption: 'this is a post',
      article_id: 0,
    };
    setQuery(db.actions.createPost({ params: data }));
  };

  const renderHomeFeed = () => {
    if (homeFeedData) {
      return homeFeedData.data.content.map((p, idx) => {
        switch (p.__typename) {
          case 'Article':
            return <div key={idx}>{p.channel.channelName}</div>;
          case 'Post':
            return <div key={idx}>{p.article.channel.channelName}</div>;
          case 'Repost':
            return <div key={idx}>Liked articles</div>;
          case 'LikedArticles':
            return <div key={idx}>Liked articles</div>;
          case 'LikedPosts':
            return <div key={idx}>Liked posts</div>;
          default:
            return null;
        }
      });
    }
  };

  return (
    <div>
      {renderHomeFeed()}
      <button disabled={status === 'loading'} onClick={handleCreatePost}>
        Create post
      </button>
    </div>
  );
};
