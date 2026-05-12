import { useState, useCallback } from 'react';
import axios from 'axios';

export function useComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async (videoId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/videos/${videoId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const postComment = useCallback(async (videoId, content) => {
    if (!content.trim()) return false;
    try {
      await axios.post(`http://localhost:5000/api/videos/${videoId}/comments`, { content });
      return true;
    } catch (err) {
      console.error('Error posting comment:', err);
      return false;
    }
  }, []);

  return { comments, loading, loadComments, postComment };
}