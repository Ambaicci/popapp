import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos';

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowStatus = useCallback(async (creatorIds) => {
    try {
      const followStatus = {};
      for (const id of creatorIds) {
        try {
          const res = await axios.get(`http://localhost:5000/api/auth/follow/check/1/${id}`);
          followStatus[id] = res.data.isFollowing;
        } catch (e) {
          followStatus[id] = false;
        }
      }
      return followStatus;
    } catch (err) {
      console.error('Error fetching follow status:', err);
      return {};
    }
  }, []);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/feed`);
      const creatorIds = [...new Set(res.data.map(v => v.user_id))];
      const followStatus = await fetchFollowStatus(creatorIds);
      
      const videosWithStatus = res.data.map(v => ({ 
        ...v, 
        userLiked: false,
        isFollowing: followStatus[v.user_id] || false
      }));
      setVideos(videosWithStatus);
    } catch (err) {
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFollowStatus]);

  const loadFollowingVideos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/feed/following`);
      const videosWithStatus = res.data.map(v => ({ 
        ...v, 
        userLiked: false,
        isFollowing: true 
      }));
      setVideos(videosWithStatus);
    } catch (err) {
      console.error('Error loading following videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMomentsVideos = useCallback(async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${API_URL}/feed/moments`);
    const videosWithStatus = res.data.map(v => ({ 
      ...v, 
      userLiked: false,
      isFollowing: false 
    }));
    setVideos(videosWithStatus);
  } catch (err) {
    console.error('Error loading moments:', err);
  } finally {
    setLoading(false);
  }
}, []);
  
  const handleLike = useCallback(async (videoId) => {
    try {
      await axios.post(`http://localhost:5000/api/videos/${videoId}/like`);
      await loadVideos();
    } catch (err) {
      console.error('Like error:', err);
    }
  }, [loadVideos]);

  const uploadVideo = useCallback(async (file, title) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title || 'Untitled');
    formData.append('description', '');
    
    try {
      await axios.post(`${API_URL}/upload`, formData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const toggleFollow = useCallback(async (creatorId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/follow/${creatorId}`);
      await loadVideos();
      return res.data;
    } catch (err) {
      console.error('Follow error:', err);
      return { following: false, error: err.message };
    }
  }, [loadVideos]);

  return {
    videos,
    loading,
    loadVideos,
    loadFollowingVideos,
    loadMomentsVideos,
    handleLike,
    uploadVideo,
    toggleFollow
  };
}