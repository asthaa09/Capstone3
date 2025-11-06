import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/api/posts');
    setPosts(res.data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const toggleLike = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/posts/like/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPosts();
  };

  return (
    <div>
      <h1>Feed</h1>
      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
          <p>{post.author.username}</p>
          <p>{post.content}</p>
          {post.image && <img src={`http://localhost:5000/uploads/${post.image}`} alt="post" width="200" />}
          <p>Likes: {post.likes.length}</p>
          <button onClick={() => toggleLike(post._id)}>Like/Unlike</button>
        </div>
      ))}
    </div>
  );
}

export default Feed;
