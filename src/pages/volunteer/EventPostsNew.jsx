import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, MessageCircle, Send, Edit2, Trash2, 
  ArrowLeft, UserPlus, UserMinus, CheckCircle, XCircle,
  Calendar, MapPin, Users, User, Clock, Loader
} from 'lucide-react';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
  getEventWithPosts,
  getPostComments,
  createPostGraphQL,
  editPostGraphQL,
  deletePostGraphQL,
  toggleLikeGraphQL,
  createCommentGraphQL,
  editCommentGraphQL,
  deleteCommentGraphQL,
  registerEventGraphQL,
  unregisterEventGraphQL
} from '../../services/eventPostsService';

export default function EventPostsNew() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // State
  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postPageInfo, setPostPageInfo] = useState(null);
  const [commentPageInfo, setCommentPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPostPage, setCurrentPostPage] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);

  // Modal states
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form states
  const [postForm, setPostForm] = useState({ content: '' });
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  // Fetch event and initial posts
  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const fetchEventData = async (postPage = 0, postSize = 5, commentSize = 10) => {
    try {
      setLoading(true);
      const response = await getEventWithPosts(eventId, postPage, postSize, commentSize);
      
      if (response.success) {
        const eventData = response.data;
        
        // Set event info
        setEvent({
          id: eventData.eventId,
          name: eventData.eventName,
          description: eventData.eventDescription,
          location: eventData.eventLocation,
          createdAt: eventData.createdAt,
          likeCount: eventData.likeCount || 0,
          creatorId: eventData.createBy?.userId,
          creatorName: eventData.createBy?.username || eventData.createBy?.fullName || 'Unknown'
        });

        // Set posts with pagination info
        if (eventData.listPosts) {
          setPostPageInfo(eventData.listPosts.pageInfo);
          setCurrentPostPage(eventData.listPosts.pageInfo?.page || 0);

          const commentInfoMap = {};
          
          const mappedPosts = eventData.listPosts.content.map(post => {
            const commentInfo = post.listComment?.pageInfo;
            if (commentInfo?.page !== undefined) {
              commentInfoMap[post.postId] = commentInfo;
            }

            const comments = post.listComment?.content?.map(c => ({
              id: c.commentId,
              postId: c.postId,
              content: c.content,
              createdAt: c.createdAt,
              likeCount: c.likeCount,
              creatorId: c.creatorInfo?.userId,
              creatorName: c.creatorInfo?.username || c.creatorInfo?.fullName || 'Anonymous',
              creatorAvatar: c.creatorInfo?.avatarId
            })) || [];

            return {
            id: post.postId,
            eventId: post.eventId,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likeCount: post.likeCount,
            commentCount: commentInfo?.totalElements ?? post.commentCount ?? comments.length,
            creatorId: post.creatorInfo?.userId,
            creatorName: post.creatorInfo?.username || post.creatorInfo?.fullName || 'Anonymous',
            creatorAvatar: post.creatorInfo?.avatarId,
            isLiked: false, // Will be determined by backend in future
            comments,
            commentPageInfo: commentInfo
            };
          });

          setPosts(mappedPosts);
          setCommentPageInfo(commentInfoMap);
        }
      } else {
        showNotification('Không thể tải sự kiện', 'error');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      showNotification('Đã xảy ra lỗi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePostPageChange = (page) => {
    if (!postPageInfo || page < 0 || page >= postPageInfo.totalPages) return;
    setCurrentPostPage(page);
    fetchEventData(page);
  };

  const handleCommentPageChange = async (postId, page, customSize) => {
    const info = commentPageInfo[postId];
    const size = customSize || info?.size || 10;
    if (page < 0 || (info && page >= info.totalPages)) return;
    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      const res = await getPostComments(postId, page, size);
      if (res.success) {
        const comments = res.data.content.map(c => ({
          id: c.commentId,
          postId: postId,
          content: c.content,
          createdAt: c.createdAt,
          likeCount: c.likeCount,
          creatorId: c.creatorInfo?.userId,
          creatorName: c.creatorInfo?.username || c.creatorInfo?.fullName || 'Anonymous',
          creatorAvatar: c.creatorInfo?.avatarId
        }));
        setPosts(prev => prev.map(p => p.id === postId ? { 
          ...p, 
          comments, 
          commentCount: res.data.pageInfo?.totalElements ?? p.commentCount 
        } : p));
        setCommentPageInfo(prev => ({ ...prev, [postId]: res.data.pageInfo }));
      }
    } catch (error) {
      console.error('Error loading comments page', error);
      showNotification('Không thể tải bình luận', 'error');
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const renderPagination = (pageInfo, onChange) => {
    if (!pageInfo || pageInfo.totalPages <= 1) return null;
    const pages = Array.from({ length: pageInfo.totalPages }, (_, i) => i);
    return (
      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          disabled={!pageInfo.hasPrevious}
          onClick={() => onChange(pageInfo.page - 1)}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: pageInfo.hasPrevious ? '#fff' : '#f3f4f6' }}
        >
          ‹
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: p === pageInfo.page ? '#3b82f6' : '#fff',
              color: p === pageInfo.page ? '#fff' : '#374151',
              minWidth: 36
            }}
          >
            {p + 1}
          </button>
        ))}
        <button
          disabled={!pageInfo.hasNext}
          onClick={() => onChange(pageInfo.page + 1)}
          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: pageInfo.hasNext ? '#fff' : '#f3f4f6' }}
        >
          ›
        </button>
      </div>
    );
  };

  // Create Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!postForm.content.trim()) {
      showNotification('Vui lòng nhập nội dung bài viết', 'error');
      return;
    }

    try {
      const response = await createPostGraphQL({
        eventId: eventId,
        content: postForm.content
      });

      if (response.success) {
        const size = postPageInfo?.size || 5;
        const totalElements = (postPageInfo?.totalElements ?? posts.length) + 1;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const newPostId = response.id || response.data?.targetId || `${Date.now()}`;

        const newPostObj = {
          id: newPostId,
          eventId,
          content: postForm.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likeCount: 0,
          commentCount: 0,
          creatorId: user?.userId,
          creatorName: user?.fullName || user?.username || 'Bạn',
          creatorAvatar: user?.avatarId,
          isLiked: false,
          comments: [],
          commentPageInfo: {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false
          }
        };

        if (posts.length < size) {
          setPosts(prev => [...prev, newPostObj]);
        } else {
          showNotification('✅ Đã đăng bài, xem ở trang sau', 'success');
        }

        setPostPageInfo({
          page: currentPostPage,
          size,
          totalElements,
          totalPages,
          hasNext: currentPostPage < totalPages - 1,
          hasPrevious: currentPostPage > 0
        });

        setPostForm({ content: '' });
        setShowCreatePostModal(false);
      } else {
        showNotification(response.message || 'Không thể đăng bài', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi đăng bài', 'error');
    }
  };

  // Edit Post
  const handleEditPost = async (e) => {
    e.preventDefault();

    if (!postForm.content.trim()) {
      showNotification('Vui lòng nhập nội dung', 'error');
      return;
    }

    try {
      const response = await editPostGraphQL({
        postId: editingPost.id,
        content: postForm.content
      });

      if (response.success) {
        showNotification('✅ Đã cập nhật bài viết', 'success');
        setShowEditPostModal(false);
        setEditingPost(null);
        setPostForm({ content: '' });
        fetchEventData(currentPostPage, postPageInfo?.size || 5, 10);
      } else {
        showNotification(response.message || 'Không thể cập nhật', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi cập nhật', 'error');
    }
  };

  // Delete Post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      const response = await deletePostGraphQL(postId);

      if (response.success) {
        showNotification('✅ Đã xóa bài viết', 'success');
        setPosts(prev => prev.filter(p => p.id !== postId));
      } else {
        showNotification(response.message || 'Không thể xóa', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi xóa', 'error');
    }
  };

  // Like/Unlike Post - Optimistic UI
  const handleLikePost = async (postId) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1
        };
      }
      return p;
    }));

    try {
      const response = await toggleLikeGraphQL(postId, 'POST');
      
      if (!response.success) {
        // Revert on error
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: !p.isLiked,
              likeCount: p.isLiked ? p.likeCount + 1 : p.likeCount - 1
            };
          }
          return p;
        }));
        showNotification('Không thể thích bài viết', 'error');
      }
    } catch (error) {
      // Revert on error
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likeCount: p.isLiked ? p.likeCount + 1 : p.likeCount - 1
          };
        }
        return p;
      }));
    }
  };

  // Create Comment
  const handleCreateComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) {
      showNotification('Vui lòng nhập bình luận', 'error');
      return;
    }

    try {
      const response = await createCommentGraphQL({
        postId: postId,
        content: content
      });

      if (response.success) {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        showNotification('✅ Đã thêm bình luận', 'success');

        const post = posts.find(p => p.id === postId);
        const info = commentPageInfo[postId];
        const size = info?.size || 10;
        const page = info?.page || 0;
        const prevTotal = info?.totalElements ?? post?.commentCount ?? post?.comments?.length ?? 0;
        const totalElements = prevTotal + 1;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));

        const newComment = {
          id: response.id || response.data?.targetId || `${postId}-${Date.now()}`,
          postId,
          content,
          createdAt: new Date().toISOString(),
          likeCount: 0,
          creatorId: user?.userId,
          creatorName: user?.username || user?.fullName || 'Bạn',
          creatorAvatar: user?.avatarId
        };

        setPosts(prev => prev.map(p => p.id === postId ? { 
          ...p, 
          comments: [...p.comments, newComment],
          commentCount: totalElements
        } : p));

        setCommentPageInfo(prev => ({
          ...prev,
          [postId]: {
            page,
            size,
            totalElements,
            totalPages,
            hasNext: page < totalPages - 1,
            hasPrevious: page > 0
          }
        }));
      } else {
        showNotification(response.message || 'Không thể bình luận', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi bình luận', 'error');
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
      const response = await deleteCommentGraphQL(commentId);

      if (response.success) {
        showNotification('✅ Đã xóa bình luận', 'success');
        // Làm mới comments trang hiện tại (giữ nguyên trang)
        const targetPost = posts.find(p => p.comments.some(c => c.id === commentId));
        if (targetPost) {
          const page = commentPageInfo[targetPost.id]?.page ?? 0;
          const size = commentPageInfo[targetPost.id]?.size || 10;
          const safePage = Math.max(0, Math.min(page, (commentPageInfo[targetPost.id]?.totalPages || 1) - 1));
          await handleCommentPageChange(targetPost.id, safePage, size);
        }
      } else {
        showNotification(response.message || 'Không thể xóa', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi xóa', 'error');
    }
  };

  // Register/Unregister Event
  const handleRegisterEvent = async () => {
    try {
      const response = isRegistered 
        ? await unregisterEventGraphQL(eventId)
        : await registerEventGraphQL(eventId);

      if (response.success) {
        setIsRegistered(!isRegistered);
        showNotification(
          isRegistered ? '✅ Đã hủy đăng ký' : '✅ Đã đăng ký tham gia',
          'success'
        );
        fetchEventData(); // Refresh member count
      } else {
        showNotification(response.message || 'Thao tác thất bại', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi xử lý đăng ký', 'error');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  // Check permissions
  const isOwner = event?.creatorId === user?.userId;
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'EVENT_MANAGER';

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Không tìm thấy sự kiện</p>
            <button 
              onClick={() => navigate('/events')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại</span>
          </button>

          {/* Event Header Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(event.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{event.location || 'Chưa có địa điểm'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{event.likeCount || 0} lượt thích</span>
                  </div>
                </div>
              </div>

              {/* Role-based Action Buttons */}
              <div className="flex flex-col gap-2">
                {/* USER: Register/Unregister */}
                {user?.role === 'USER' && (
                  <button
                    onClick={handleRegisterEvent}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isRegistered
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <UserMinus size={18} />
                        <span>Hủy đăng ký</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Đăng ký tham gia</span>
                      </>
                    )}
                  </button>
                )}

                {/* EVENT_MANAGER (owner): Edit Event, Manage Volunteers */}
                {isOwner && isManager && (
                  <>
                    <button
                      onClick={() => navigate(`/manager/events/edit/${eventId}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg font-medium hover:bg-yellow-100"
                    >
                      <Edit2 size={18} />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button
                      onClick={() => navigate(`/manager/volunteerList/${eventId}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100"
                    >
                      <Users size={18} />
                      <span>Quản lý tình nguyện viên</span>
                    </button>
                  </>
                )}

                {/* ADMIN: Approve/Delete Event */}
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {/* TODO: Approve event */}}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100"
                    >
                      <CheckCircle size={18} />
                      <span>Phê duyệt</span>
                    </button>
                    <button
                      onClick={() => {/* TODO: Delete event */}}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                      <span>Xóa sự kiện</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreatePostModal(true)}
            className="w-full bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-gray-500">Chia sẻ suy nghĩ của bạn...</span>
          </button>

          {/* Posts List */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">Chưa có bài viết nào</p>
              <p className="text-gray-400 text-sm">Hãy là người đầu tiên chia sẻ!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.userId}
                  isAdmin={isAdmin}
                  onLike={() => handleLikePost(post.id)}
                  onDelete={() => handleDeletePost(post.id)}
                  onEdit={() => {
                    setEditingPost(post);
                    setPostForm({ content: post.content });
                    setShowEditPostModal(true);
                  }}
                  commentInput={commentInputs[post.id] || ''}
              onCommentChange={(value) => setCommentInputs(prev => ({ ...prev, [post.id]: value }))}
              onCommentSubmit={() => handleCreateComment(post.id)}
              onDeleteComment={handleDeleteComment}
              commentPageInfo={commentPageInfo[post.id]}
              onCommentPageChange={(page) => handleCommentPageChange(post.id, page)}
              renderPagination={renderPagination}
              formatDate={formatDate}
            />
          ))}

          {renderPagination(postPageInfo, handlePostPageChange)}
        </div>
      )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <Modal
          title="Tạo bài viết mới"
          onClose={() => {
            setShowCreatePostModal(false);
            setPostForm({ content: '' });
          }}
        >
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              value={postForm.content}
              onChange={(e) => setPostForm({ content: e.target.value })}
              placeholder="Chia sẻ suy nghĩ của bạn về sự kiện này..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              required
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreatePostModal(false);
                  setPostForm({ content: '' });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
              >
                Đăng bài
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Post Modal */}
      {showEditPostModal && (
        <Modal
          title="Chỉnh sửa bài viết"
          onClose={() => {
            setShowEditPostModal(false);
            setEditingPost(null);
            setPostForm({ content: '' });
          }}
        >
          <form onSubmit={handleEditPost} className="space-y-4">
            <textarea
              value={postForm.content}
              onChange={(e) => setPostForm({ content: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              required
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditPostModal(false);
                  setEditingPost(null);
                  setPostForm({ content: '' });
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Post Card Component
function PostCard({ 
  post, 
  currentUserId, 
  isAdmin,
  onLike, 
  onDelete, 
  onEdit,
  commentInput,
  onCommentChange,
  onCommentSubmit,
  onDeleteComment,
  commentPageInfo,
  onCommentPageChange,
  renderPagination,
  formatDate 
}) {
  const [showComments, setShowComments] = useState(true);
  const isOwner = post.creatorId === currentUserId;
  const totalComments = commentPageInfo?.totalElements ?? post.commentCount ?? post.comments.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
            {post.creatorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{post.creatorName}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {(isOwner || isAdmin) && (
          <div className="flex gap-2">
            {isOwner && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit2 size={18} className="text-gray-600" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>

      {/* Like & Comment Stats */}
      <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-4">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            post.isLiked
              ? 'text-red-500 bg-red-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
          <span>{post.likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <MessageCircle size={20} />
          <span className="font-medium">{totalComments} bình luận</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3">
          {/* Comment List */}
          {post.comments.map(comment => (
            <div key={comment.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {comment.creatorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {comment.creatorName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    {(comment.creatorId === currentUserId || isAdmin) && (
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-600 text-xs"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}

          {commentPageInfo && renderPagination(commentPageInfo, onCommentPageChange)}

          {/* Add Comment Input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => onCommentChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onCommentSubmit();
                }
              }}
              placeholder="Viết bình luận..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={onCommentSubmit}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
