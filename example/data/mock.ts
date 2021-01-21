export const users = [
  {
    id: 1,
    username: 'nishan',
  },
  {
    id: 2,
    username: 'chirag',
  },
];

export const posts = [
  { id: 1, text: 'hello world', user: users[0], isLiked: true },
  { id: 2, text: 'use useDB', user: users[0], isLiked: false },
  { id: 3, text: 'useDB is cool', user: users[1], isLiked: false },
  { id: 4, text: 'nishan sucks', user: users[1], isLiked: true },
  { id: 5, text: 'hello world', user: users[1], isLiked: false },
  { id: 6, text: 'use useDB', user: users[1], isLiked: false },
  { id: 7, text: 'useDB is cool', user: users[1], isLiked: false },
  { id: 8, text: 'nishan sucks', user: users[1], isLiked: false },
  { id: 9, text: 'nishan sucks', user: users[1], isLiked: false },
  { id: 10, text: 'nishan sucks', user: users[1], isLiked: false },
  { id: 11, text: 'nishan sucks', user: users[1], isLiked: false },
  { id: 12, text: 'nishan sucks', user: users[1], isLiked: false },
  { id: 13, text: 'nishan sucks', user: users[1], isLiked: false },
];

export const comments = [
  {
    id: 1,
    post: posts[0],
    text: 'this sucks',
  },
  {
    id: 2,
    post: posts[1],
    text: 'this doesnt suck',
  },
  {
    id: 3,
    post: posts[1],
    text: 'this sucks as well',
  },
  {
    id: 4,
    post: posts[0],
    text: 'this doesnt suck for sure',
  },
];
