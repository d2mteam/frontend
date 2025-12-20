/**
 * Post Service
 * - Đọc: GraphQL (getPost/findPosts)
 * - Ghi: REST (/api/posts, /api/comments, /api/likes)
 */
import graphqlClient from '../api/graphqlClient';
import axiosClient from '../api/axiosClient';

const parseModeration = (res) => {
  const success = res?.result === 'SUCCESS' || !res?.result;
  const reason = res?.reasonCode;
  const msg = res?.message || '';
  const combined = reason ? `[${reason}] ${msg}` : msg;
  return {
    success,
    message: combined,
    error: success ? undefined : combined,
    data: res,
    id: res?.targetId,
    reasonCode: reason,
    toastType: success ? 'success' : 'error',
  };
};

// Create a new post (REST)
export const createPost = async ({ eventId, body }) => {
  try {
    const data = await axiosClient.post('/posts', { eventId, content: body });
    return parseModeration(data);
  } catch (error) {
    console.error('Create post error:', error);
    return { success: false, error: error.message || 'Không thể tạo bài viết' };
  }
};

// Edit existing post (REST)
export const editPost = async (postId, content) => {
  try {
    const data = await axiosClient.put('/posts', { postId, content });
    return parseModeration(data);
  } catch (error) {
    console.error('Edit post error:', error);
    return { success: false, error: error.message };
  }
};

// Get posts (fallback, không có filter theo event trong backend hiện tại)
export const getPostsByEvent = async (eventId, page = 0, size = 20) => {
  try {
    const query = `
      query FindPosts($page: Int!, $size: Int!) {
        findPosts(page: $page, size: $size) {
          content {
            postId
            content
            createdAt
            updatedAt
            likeCount
            createBy {
              userId
              username
              fullName
              avatarId
            }
            listComment(page: 0, size: 5) {
              content {
                commentId
                content
                createdAt
                updatedAt
                likeCount
                createBy {
                  userId
                  username
                  fullName
                  avatarId
                }
              }
            }
          }
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { page, size });
    return { success: true, data: { posts: data.findPosts.content } };
  } catch (error) {
    console.error('Get posts error:', error);
    return { success: false, error: error.message };
  }
};

// Get post by ID with nested comments
export const getPostById = async (postId) => {
  try {
    const query = `
      query GetPost($postId: ID!) {
        getPost(postId: $postId) {
          postId
          content
          createdAt
          updatedAt
          likeCount
          createBy {
            userId
            username
            fullName
            avatarId
          }
          listComment(page: 0, size: 50) {
            content {
              commentId
              content
              createdAt
              updatedAt
              likeCount
              createBy {
                userId
                username
                fullName
                avatarId
              }
            }
          }
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { postId });
    return { success: true, data: data.getPost };
  } catch (error) {
    console.error('Get post error:', error);
    return { success: false, error: error.message };
  }
};

// Like target (REST)
export const toggleLike = async (targetId, targetType = 'POST') => {
  try {
    const data = await axiosClient.post('/likes', { targetType, targetId });
    return parseModeration(data);
  } catch (error) {
    console.error('Toggle like error:', error);
    return { success: false, error: error.message };
  }
};

// Alias for EventFeed component
export const likePost = toggleLike;

// Unlike a target (REST)
export const unlikePost = async (targetId, targetType = 'POST') => {
  try {
    const data = await axiosClient.delete('/likes', { data: { targetType, targetId } });
    return parseModeration(data);
  } catch (error) {
    console.error('Unlike error:', error);
    return { success: false, error: error.message };
  }
};

// Add a comment (REST)
export const addComment = async (postId, text) => {
  try {
    const cleanPostId = typeof postId === 'string' 
      ? postId.replace(/^(mock-post-|post_\d+_)/, '')
      : postId;
    
    const data = await axiosClient.post('/comments', { postId: cleanPostId, content: text });
    return parseModeration(data);
  } catch (error) {
    console.error('Add comment error:', error);
    return { success: false, error: error.message };
  }
};

// Alias for EventFeed component
export const createComment = async ({ postId, content }) => {
  return addComment(postId, content);
};

// Edit a comment (REST)
export const editComment = async (commentId, content) => {
  try {
    const data = await axiosClient.put('/comments', { commentId, content });
    return parseModeration(data);
  } catch (error) {
    console.error('Edit comment error:', error);
    return { success: false, error: error.message };
  }
};

// Delete a post (REST)
export const deletePost = async (postId) => {
  try {
    const data = await axiosClient.delete(`/posts/${postId}`);
    return parseModeration(data);
  } catch (error) {
    console.error('Delete post error:', error);
    return { success: false, error: error.message };
  }
};

// Delete a comment (REST) - accepts either (commentId) or (_postId, commentId)
export const deleteComment = async (arg1, arg2) => {
  const commentId = arg2 ?? arg1;
  try {
    const data = await axiosClient.delete(`/comments/${commentId}`);
    return parseModeration(data);
  } catch (error) {
    console.error('Delete comment error:', error);
    return { success: false, error: error.message };
  }
};
