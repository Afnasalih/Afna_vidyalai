import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import {useWindowWidth} from '../../context/WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if more posts are available
  const [page, setPage] = useState(1); // Track the current page

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/v1/posts', {
          params: { start: (page - 1) * (isSmallerDevice ? 5 : 10), limit: isSmallerDevice ? 5 : 10 },
        });

        if (data.length === 0) {
          setHasMore(false); // No more posts available
        } else {
          setPosts(prevPosts => [...prevPosts, ...data]);
        }
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [page, isSmallerDevice]);

  const handleClick = () => {
    setPage(prevPage => prevPage + 1); // Load the next page of posts
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
