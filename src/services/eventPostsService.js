/**
 * EventPosts Service
 * - Đọc: GraphQL (getEvent + listPost/listComment, getPost)
 * - Ghi: tái dùng REST helpers từ postService/eventService
 */
import graphqlClient from '../api/graphqlClient';
import { getEventById, registerForEvent, unregisterFromEvent } from './eventService';
import {
  createPost,
  editPost,
  deletePost,
  toggleLike,
  unlikePost,
  addComment,
  editComment,
  deleteComment
} from './postService';

/**
 * Get Event với nested Posts & Comments
 */
export const getEventWithPosts = async (eventId, postPage = 0, postSize = 10, commentSize = 5) => {
  const result = await getEventById(eventId, postPage, postSize, commentSize);
  if (result.success && result.data?.listPost) {
    const listPost = result.data.listPost.content?.map(post => {
      const normalizedComments = post.listComment?.content?.map(c => ({
        ...c,
        creatorInfo: c.createBy,
      })) || [];

      return {
        ...post,
        eventId: post.eventId || eventId,
        creatorInfo: post.createBy,
        commentCount: normalizedComments.length,
        listComment: {
          ...post.listComment,
          content: normalizedComments,
        },
      };
    }) || [];

    result.data.listPost = {
      ...result.data.listPost,
      content: listPost,
    };
    // Giữ tương thích với UI cũ đang dùng listPosts
    result.data.listPosts = result.data.listPost;
  }
  return result;
};

/**
 * Load comments cho 1 post (GraphQL)
 */
export const getPostComments = async (postId, page = 0, size = 10) => {
  try {
    const query = `
      query GetPostComments($postId: ID!, $page: Int!, $size: Int!) {
        getPost(postId: $postId) {
          postId
          listComment(page: $page, size: $size) {
            pageInfo {
              page
              size
              totalElements
              totalPages
              hasNext
              hasPrevious
            }
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

    const data = await graphqlClient.query(query, { postId, page, size });

    return {
      success: true,
      data: data.getPost.listComment
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ====== POST CRUD (REST) ====== //
export const createPostGraphQL = createPost;
export const editPostGraphQL = (input) => editPost(input.postId, input.content);
export const deletePostGraphQL = (postId) => deletePost(postId);

// ====== LIKE ====== //
export const toggleLikeGraphQL = (targetId, targetType) => toggleLike(targetId, targetType || 'POST');
export const unlikeGraphQL = (targetId, targetType) => unlikePost(targetId, targetType || 'POST');

// ====== COMMENT CRUD (REST) ====== //
export const createCommentGraphQL = (input) => addComment(input.postId, input.content);
export const editCommentGraphQL = (input) => editComment(input.commentId, input.content);
export const deleteCommentGraphQL = (commentId) => deleteComment(commentId);

// ====== EVENT REGISTRATION (REST) ====== //
export const registerEventGraphQL = (eventId) => registerForEvent(eventId);
export const unregisterEventGraphQL = (eventId) => unregisterFromEvent(eventId);
