const express = require('express');
const { fetchPosts } = require('./posts.service');
const axios = require('axios');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try{
  const posts = await fetchPosts();

  const postsWithImages = await posts.reduce(async (accPromise, post) => {
    const acc = await accPromise;
    try {
      // Fetch images from the API for each post
      const { data: images } = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
      
      acc.push({
        ...post,
        images: images.map(image => ({ url: image.thumbnailUrl })), // Use `thumbnailUrl` for carousel images
      });
    } catch (error) {
      console.error(`Error fetching images for post ${post.id}:`, error);
      acc.push({
        ...post,
        images: [], // Handle error by returning an empty array
      });
    }
    return acc;
  }, Promise.resolve([]));

  res.json(postsWithImages);
} catch (error) {
  console.error('Error fetching posts:', error);
  res.status(500).send('Internal Server Error');
}
});

module.exports = router;
