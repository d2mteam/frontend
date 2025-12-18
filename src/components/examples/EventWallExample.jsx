/**
 * Example Component - Event Wall với Custom Hooks
 * Demonstrates proper usage of useEventDetail and useComments
 */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventDetail } from '../../hooks/useEvents';
import { useCreatePost, usePostMutations, useComments } from '../../hooks/usePosts';

export default function EventWallExample() {
  const { eventId } = useParams();
  const { event, posts, loading, error, refetch } = useEventDetail(eventId);
  const { createNewPost, loading: postLoading } = useCreatePost();
  const { likePost } = usePostMutations();
  const { createComment, loading: commentLoading } = useComments();

  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  // Handle new post creation
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const result = await createNewPost(eventId, 'Post Title', newPostContent);
    if (result.success) {
      setNewPostContent('');
      refetch(); // Reload posts
    }
  };

  // Handle like
  const handleLike = async (postId) => {
    await likePost(postId);
    refetch(); // Update UI
  };

  // Handle comment
  const handleComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    const result = await createComment(postId, text);
    if (result.success) {
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      refetch();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-600">❌ {error}</p>
        <button onClick={refetch} className="mt-2 text-blue-500 underline">
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state
  if (!event) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy sự kiện</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>📍 {event.location}</span>
          <span>👥 {event.memberCount} thành viên</span>
          <span>📝 {event.postCount} bài viết</span>
        </div>
      </div>

      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSubmitPost}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Chia sẻ suy nghĩ của bạn..."
            className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <button
            type="submit"
            disabled={postLoading || !newPostContent.trim()}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {postLoading ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Chưa có bài viết nào</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.creator?.avatarId || '/default-avatar.png'}
                  alt={post.creator?.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{post.creator?.username || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Post Actions */}
              <div className="flex gap-4 border-t pt-3">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                >
                  ❤️ {post.likeCount} Likes
                </button>
                <span className="text-gray-600">💬 {post.commentCount} Comments</span>
              </div>

              {/* Comments Section */}
              <div className="mt-4 border-t pt-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 mb-3">
                    <img
                      src={comment.creator?.avatarId || '/default-avatar.png'}
                      alt={comment.creator?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 bg-gray-100 rounded-lg p-3">
                      <p className="font-semibold text-sm">{comment.creator?.username}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {/* Add Comment */}
                <div className="flex gap-3 mt-3">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ 
                      ...prev, 
                      [post.id]: e.target.value 
                    }))}
                    placeholder="Viết bình luận..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    disabled={commentLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
