export const users = [
  {
    id: 1,
    username: 'john doe',
  },
  {
    id: 2,
    username: 'jane',
  },
];

export const posts = [
  { id: 1, text: 'hello earth', user: users[0], isLiked: true },
  { id: 2, text: 'hello mars', user: users[0], isLiked: false },
  { id: 3, text: 'hello jupiter', user: users[1], isLiked: false },
  { id: 4, text: 'hello pluto', user: users[1], isLiked: true },
  { id: 5, text: 'hello sun', user: users[1], isLiked: false },
  { id: 6, text: 'hello moon', user: users[1], isLiked: false },
  { id: 7, text: 'hello venus', user: users[1], isLiked: false },
  { id: 8, text: 'hello saturn', user: users[1], isLiked: false },
  { id: 9, text: 'hello from react', user: users[1], isLiked: false },
  { id: 10, text: 'hello from vue', user: users[1], isLiked: false },
  { id: 11, text: 'hello from svelte', user: users[1], isLiked: false },
  { id: 12, text: 'hello from x', user: users[1], isLiked: false },
  { id: 13, text: 'hello from y', user: users[1], isLiked: false },
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
