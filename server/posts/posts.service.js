const axios = require('axios').default;

/**
 * Fetches posts from a remote API.
 * @async
 * @param {Object} [params] - The parameters for fetching posts.
 * @param {number} [params.start=0] - The start index of posts to fetch.
 * @param {number} [params.limit=10] - The maximum number of posts to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
async function fetchPosts(params) {
  const { start = 0, limit = 10 } = params || {};
  const { data: posts } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts?limit',
    {
      params: {
        _start: start,
        _limit: limit,
      },
    },
  );

  const userPromises = posts.map(post =>
    axios.get(`https://jsonplaceholder.typicode.com/users/${post.userId}`)
  );

  const usersResponse = await Promise.all(userPromises);
  const users = usersResponse.map(response => response.data);

  // Combine posts with user info
  const postsWithUserInfo = posts.map(post => {
    const user = users.find(user => user.id === post.userId);
    return {
      ...post,
      user: {
        name: user.name,
        email: user.email,
        initials: `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`.toUpperCase(),
      },
      images: [], // Placeholder for images if needed
    };
  });

  return postsWithUserInfo;
}

module.exports = { fetchPosts };
