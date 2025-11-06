import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('content', content);
    if(image) formData.append('image', image);
    await axios.post('http://localhost:5000/api/posts', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePost;
