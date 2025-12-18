/**
 * Custom Hooks for Post & Comment Operations
 * Using GraphQL Mutations
 */
import { useState } from 'react';
import { 
  createPost, 
  editPost, 
  deletePost, 
  toggleLike, 
  unlikePost,
  addComment,
  editComment,
  deleteComment 
} from '../services/postService';

/**
 * Hook for post creation
 * @returns {object} { createNewPost, loading, error }
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewPost = async (eventId, title, body, image = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createPost({ eventId, title, body, image });
      
      if (response.success) {
        return { success: true, postId: response.id };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { createNewPost, loading, error };
};

/**
 * Hook for post mutations (edit, delete, like)
 * @returns {object} - Mutation functions
 */
export const usePostMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editPostContent = async (postId, content) => {
    try {
      setLoading(true);
      setError(null);
      const response = await editPost(postId, content);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removePost = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deletePost(postId);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await toggleLike(postId);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const unlikePostAction = async (postId) => {
    try {
      const response = await unlikePost(postId);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return { 
    editPostContent, 
    removePost, 
    likePost, 
    unlikePostAction,
    loading, 
    error 
  };
};

/**
 * Hook for comment operations
 * @returns {object} - Comment mutation functions
 */
export const useComments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createComment = async (postId, text) => {
    try {
      setLoading(true);
      setError(null);
      const response = await addComment(postId, text);
      
      if (response.success) {
        return { success: true, commentId: response.id };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      setLoading(true);
      setError(null);
      const response = await editComment(commentId, content);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removeComment = async (commentId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deleteComment(commentId);
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { 
    createComment, 
    updateComment, 
    removeComment,
    loading, 
    error 
  };
};
