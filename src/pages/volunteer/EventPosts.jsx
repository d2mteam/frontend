import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from '../../contexts/AuthContext';
import { getPostsByEvent, createPost, toggleLike, addComment, deletePost, deleteComment, editComment } from '../../services/postService';
import { getEventById } from '../../services/eventService';
import { getPostComments } from '../../services/eventPostsService';
import { showNotification as showToast } from '../../services/toastService';
import '../../assets/styles/unified-dashboard.css';

export default function EventPosts() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postPageInfo, setPostPageInfo] = useState(null);
  const [commentPageInfo, setCommentPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPostPage, setCurrentPostPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', image: null });
  const [commentInputs, setCommentInputs] = useState({});
  const [commentMenus, setCommentMenus] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventAndPosts(0, 5, 10);
    }
  }, [eventId]);

  const fetchEventAndPosts = async (postPage = 0, postSize = 5, commentSize = 10) => {
    try {
      setLoading(true);
      
      // Fetch event details with nested posts using GraphQL
      const eventResponse = await getEventById(eventId, postPage, postSize, commentSize);
      if (eventResponse.success) {
        const eventData = eventResponse.data;
        setEvent({
          id: eventData.eventId,
          title: eventData.eventName || 'Sự kiện',
          description: eventData.eventDescription || '',
          location: eventData.eventLocation || 'Chưa xác định',
          startAt: eventData.createdAt,
          likeCount: eventData.likeCount || 0,
          isLiked: false
        });

        // Map nested posts from GraphQL
        if (eventData.listPost?.content) {
          setPostPageInfo(eventData.listPost.pageInfo || null);
          setCurrentPostPage(eventData.listPost.pageInfo?.page || 0);

          const mapped = eventData.listPost.content.map(post => ({
            id: post.postId,
            title: '',
            body: post.content,
            image: null,
            author: post.createBy?.fullName || post.createBy?.username || 'Anonymous',
            authorId: post.createBy?.userId,
            createdAt: new Date(post.createdAt).toLocaleString('vi-VN'),
            likes: [],
            likesCount: post.likeCount || 0,
            comments: post.listComment?.content?.map(c => ({
              id: c.commentId,
              content: c.content,
              author: c.createBy?.fullName || c.createBy?.username || 'Anonymous',
              authorId: c.createBy?.userId,
              createdAt: new Date(c.createdAt).toLocaleString('vi-VN'),
              likeCount: c.likeCount || 0,
              isLiked: false
            })) || []
          }));
          setPosts(mapped);
          const commentInfo = {};
          eventData.listPost.content.forEach(p => {
            if (p.listComment?.pageInfo) {
              commentInfo[p.postId] = p.listComment.pageInfo;
            }
          });
          setCommentPageInfo(commentInfo);
        }
      }
    } catch (error) {
      console.error('Error fetching event wall:', error);
      showToast('Không thể tải bảng tin', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.body.trim()) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const response = await createPost({
        body: newPost.body,
        eventId
      });

      if (response.success) {
        showToast('✅ Đã đăng bài viết', 'success');
        setNewPost({ title: '', body: '', image: null });
        setShowCreateModal(false);
        const size = postPageInfo?.size || 5;
        const totalElements = (postPageInfo?.totalElements ?? posts.length) + 1;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const newPostId = response.id || response.data?.targetId || `${Date.now()}`;
        const mappedPost = {
          id: newPostId,
          title: '',
          body: newPost.body,
          image: null,
          author: user?.fullName || user?.username || user?.email || 'Bạn',
          authorId: user?.userId,
          createdAt: new Date().toLocaleString('vi-VN'),
          likes: [],
          likesCount: 0,
          comments: []
        };

        if (posts.length < size) {
          setPosts(prev => [...prev, mappedPost]);
        } else {
          showToast('✅ Đã đăng bài, xem ở trang sau', 'success');
        }
        setPostPageInfo({
          page: currentPostPage,
          size,
          totalElements,
          totalPages,
          hasNext: currentPostPage < totalPages - 1,
          hasPrevious: currentPostPage > 0
        });
      } else {
        showToast(response.error || 'Không thể đăng bài', 'error');
      }
    } catch (error) {
      showToast('Lỗi khi đăng bài', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const wasLiked = posts.find(p => p.id === postId)?.likes.includes(user?.id);
      const response = await toggleLike(postId);
      if (response.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            const isLiked = p.likes.includes(user?.id);
            return {
              ...p,
              likes: isLiked 
                ? p.likes.filter(id => id !== user?.id)
                : [...p.likes, user?.id],
              likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1
            };
          }
          return p;
        }));
        showToast(wasLiked ? 'Đã bỏ thích' : 'Đã thích bài viết', 'success');
      }
    } catch (error) {
      showToast('Không thể like bài viết', 'error');
    }
  };

  const handleLikeEvent = async () => {
    if (!event) return;
    const nextLiked = !event.isLiked;
    const nextCount = Math.max(0, (event.likeCount || 0) + (nextLiked ? 1 : -1));
    setEvent(prev => ({ ...prev, isLiked: nextLiked, likeCount: nextCount }));
    try {
      const res = await toggleLike(event.id, 'EVENT');
      if (!res.success) {
        setEvent(prev => ({ ...prev, isLiked: !nextLiked, likeCount: event.likeCount }));
        showToast('Không thể thích sự kiện', 'error');
      }
    } catch (error) {
      setEvent(prev => ({ ...prev, isLiked: !nextLiked, likeCount: event.likeCount }));
      showToast('Không thể thích sự kiện', 'error');
    }
  };

  const handleComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) {
      showToast('Vui lòng nhập nội dung bình luận', 'error');
      return;
    }

    try {
      const response = await addComment(postId, content);
      if (response.success) {
        const info = commentPageInfo[postId];
        const size = info?.size || 10;
        const post = posts.find(p => p.id === postId);
        const prevTotal = info?.totalElements ?? post?.comments?.length ?? 0;
        const totalElements = prevTotal + 1;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));

        const newComment = {
          id: response.id || response.data?.targetId || `${postId}-${Date.now()}`,
          content,
          author: user?.fullName || user?.username || user?.email || 'Bạn',
          authorId: user?.userId,
          createdAt: new Date().toLocaleString('vi-VN'),
          likeCount: 0,
          isLiked: false
        };

        setPosts(prev => prev.map(p => p.id === postId ? { 
          ...p, 
          comments: [...p.comments, newComment] 
        } : p));
        setCommentPageInfo(prev => ({
          ...prev,
          [postId]: {
            page: info?.page || 0,
            size,
            totalElements,
            totalPages,
            hasNext: (info?.page || 0) < totalPages - 1,
            hasPrevious: (info?.page || 0) > 0
          }
        }));

        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        showToast('✅ Đã thêm bình luận', 'success');
      } else {
        showToast(response.error || 'Không thể thêm bình luận', 'error');
      }
    } catch (error) {
      showToast('Lỗi khi thêm bình luận', 'error');
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const nextLiked = !c.isLiked;
              return {
                ...c,
                isLiked: nextLiked,
                likeCount: Math.max(0, (c.likeCount || 0) + (nextLiked ? 1 : -1))
              };
            }
            return c;
          })
        };
      }
      return p;
    }));

    try {
      const res = await toggleLike(commentId, 'COMMENT');
      if (!res.success) {
        // revert
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: p.comments.map(c => {
                if (c.id === commentId) {
                  const nextLiked = !c.isLiked;
                  return {
                    ...c,
                    isLiked: nextLiked,
                    likeCount: Math.max(0, (c.likeCount || 0) + (nextLiked ? 1 : -1))
                  };
                }
                return c;
              })
            };
          }
          return p;
        }));
        showToast('Không thể thích bình luận', 'error');
      }
    } catch (error) {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map(c => {
              if (c.id === commentId) {
                const nextLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked: nextLiked,
                  likeCount: Math.max(0, (c.likeCount || 0) + (nextLiked ? 1 : -1))
                };
              }
              return c;
            })
          };
        }
        return p;
      }));
      showToast('Không thể thích bình luận', 'error');
    }
  };

  const startEditComment = (postId, commentId, currentContent) => {
    setCommentMenus(prev => ({ ...prev, [`${postId}_${commentId}`]: false }));
    setEditingCommentInputs(prev => ({ ...prev, [commentId]: currentContent }));
  };

  const submitEditComment = async (postId, commentId) => {
    const newContent = editingCommentInputs[commentId];
    if (!newContent || !newContent.trim()) return;
    try {
      const res = await editComment(commentId, newContent.trim());
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: p.comments.map(c => c.id === commentId ? { ...c, content: newContent.trim() } : c)
            };
          }
          return p;
        }));
        setEditingCommentInputs(prev => {
          const next = { ...prev };
          delete next[commentId];
          return next;
        });
        showToast('Đã cập nhật bình luận', 'success');
      } else {
        showToast(res.error || 'Không thể cập nhật bình luận', 'error');
      }
    } catch (error) {
      showToast('Không thể cập nhật bình luận', 'error');
    }
  };

  const cancelEditComment = (commentId) => {
    setEditingCommentInputs(prev => {
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      const response = await deletePost(postId);
      if (response.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        showToast('✅ Đã xóa bài viết', 'success');
      } else {
        showToast(response.error || 'Không thể xóa bài viết', 'error');
      }
    } catch (error) {
      showToast('Lỗi khi xóa bài viết', 'error');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
      const response = await deleteComment(postId, commentId);
      if (response.success) {
        const info = commentPageInfo[postId];
        const size = info?.size || 10;
        const post = posts.find(p => p.id === postId);
        const prevTotal = info?.totalElements ?? post?.comments?.length ?? 0;
        const totalElements = Math.max(0, prevTotal - 1);
        const totalPages = Math.max(1, Math.ceil(totalElements / size));

        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: p.comments.filter(c => c.id !== commentId)
            };
          }
          return p;
        }));
        setCommentPageInfo(prev => ({
          ...prev,
          [postId]: {
            page: Math.min(info?.page || 0, totalPages - 1),
            size,
            totalElements,
            totalPages,
            hasNext: (info?.page || 0) < totalPages - 1,
            hasPrevious: (info?.page || 0) > 0
          }
        }));
        showToast('✅ Đã xóa bình luận', 'success');
      } else {
        showToast(response.error || 'Không thể xóa bình luận', 'error');
      }
    } catch (error) {
      showToast('Lỗi khi xóa bình luận', 'error');
    }
  };

  const handleEditComment = async (postId, commentId, currentContent) => {
    const newContent = prompt('Chỉnh sửa bình luận', currentContent);
    if (!newContent || !newContent.trim()) return;
    try {
      const res = await editComment(commentId, newContent.trim());
      if (res.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: p.comments.map(c => c.id === commentId ? { ...c, content: newContent.trim() } : c)
            };
          }
          return p;
        }));
        showToast('Đã cập nhật bình luận', 'success');
      } else {
        showToast(res.error || 'Không thể cập nhật bình luận', 'error');
      }
    } catch (error) {
      showToast('Không thể cập nhật bình luận', 'error');
    } finally {
      setCommentMenus(prev => ({ ...prev, [`${postId}_${commentId}`]: false }));
    }
  };

  const handlePostPageChange = (page) => {
    if (!postPageInfo) return;
    if (page < 0 || page >= postPageInfo.totalPages) return;
    setCurrentPostPage(page);
    fetchEventAndPosts(page, postPageInfo.size || 5, 10);
  };

  const handleCommentPageChange = async (postId, page) => {
    const info = commentPageInfo[postId];
    if (!info || page < 0 || page >= info.totalPages) return;
    try {
      const res = await getPostComments(postId, page, info.size || 10);
      if (res.success) {
        const comments = res.data.content.map(c => ({
          id: c.commentId,
          content: c.content,
          author: c.creatorInfo?.fullName || c.creatorInfo?.username || 'Anonymous',
          authorId: c.creatorInfo?.userId,
          createdAt: c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : '',
          likeCount: c.likeCount || 0,
          isLiked: false
        }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments } : p));
        setCommentPageInfo(prev => ({ ...prev, [postId]: res.data.pageInfo }));
      }
    } catch (error) {
      console.error('Error loading comments page', error);
      showToast('Không thể tải bình luận', 'error');
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ảnh không được vượt quá 5MB', 'error');
        return;
      }
      setNewPost(prev => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content" style={{ maxWidth: "1200px", width: "80%", marginRight: "100px" }}>
          {/* Header */}
          <div className="events-header" style={{ marginBottom: '12px' }}>
            <div>
              <button 
                onClick={() => navigate(-1)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer',
                  marginRight: '12px'
                }}
              >
                ←
              </button>
              <h2 style={{ display: 'inline' }}>Bảng tin sự kiện</h2>
            </div>
          </div>

          {event && (
            <div style={{ marginBottom: '20px', padding: '14px 16px', background: '#f9fafb', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '15px', color: '#111827' }}>
                  <div><strong>Tên sự kiện:</strong> {event.title}</div>
                  <div><strong>ID:</strong> {event.id}</div>
                  <div><strong>Mô tả:</strong> {event.description || 'Chưa có mô tả'}</div>
                  <div><strong>Địa điểm:</strong> {event.location || 'Chưa xác định'}</div>
                  <div><strong>Thời gian tạo:</strong> {event.startAt ? new Date(event.startAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}</div>
                </div>
                <button
                  onClick={handleLikeEvent}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: '1px solid #e5e7eb',
                    background: event.isLiked ? '#e0ecff' : '#fff',
                    color: event.isLiked ? '#2563eb' : '#374151',
                    cursor: 'pointer',
                    fontWeight: 600,
                    alignSelf: 'flex-end'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>👍</span>
                  <span>{event.likeCount || 0} lượt thích</span>
                </button>
              </div>
            </div>
          )}

          {/* Create Post Button */}
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'white',
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.background = 'white';
              }}
            >
              <span style={{ fontSize: '20px' }}>✍️</span>
              <span>Chia sẻ suy nghĩ của bạn về sự kiện này...</span>
            </button>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="loading">Đang tải bảng tin...</div>
          ) : posts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'white',
              borderRadius: '12px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ fontSize: '16px', fontWeight: 500 }}>Chưa có bài viết nào</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Hãy là người đầu tiên chia sẻ!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {posts.map(post => (
                <div 
                  key={post.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Post Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600
                      }}>
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>{post.author}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>{post.createdAt}</div>
                      </div>
                    </div>
                    {post.authorId === user?.id && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🗑️ Xóa
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '12px' }}>
                    {post.body}
                  </p>

                  {/* Post Image */}
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        maxHeight: '400px',
                        objectFit: 'cover'
                      }}
                    />
                  )}

                  {/* Like Button */}
                  <div style={{ 
                    borderTop: '1px solid #e5e7eb',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '12px 0',
                    marginBottom: '16px'
                  }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: post.likes.includes(user?.id) ? '#2563eb' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                      <span style={{ fontSize: '18px' }}>👍</span>
                      <span>{post.likesCount} lượt thích</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                      💬 Bình luận ({post.comments.length})
                    </div>

                    {/* Comments List */}
                    {post.comments.map(comment => (
                      <div 
                        key={comment.id}
                        style={{
                          background: '#f9fafb',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{comment.author}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{comment.createdAt}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                        {comment.authorId === user?.id && (
                          <div style={{ position: 'relative' }}>
                            <button
                              onClick={() => setCommentMenus(prev => ({ ...prev, [`${post.id}_${comment.id}`]: !prev[`${post.id}_${comment.id}`] }))}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                fontSize: '16px',
                                padding: 4
                              }}
                              aria-label="Mở menu bình luận"
                            >
                              ⋯
                            </button>
                            {commentMenus[`${post.id}_${comment.id}`] && (
                              <div
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: 24,
                                  background: '#fff',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: 8,
                                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                  padding: '6px 0',
                                  zIndex: 10,
                                  minWidth: 120
                                }}
                              >
                                <button
                                  onClick={() => startEditComment(post.id, comment.id, comment.content)}
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    color: '#111827'
                                  }}
                                >
                                  Chỉnh sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    color: '#ef4444'
                                  }}
                                >
                                  Xóa
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => handleLikeComment(post.id, comment.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            border: 'none',
                            background: 'transparent',
                            color: comment.isLiked ? '#2563eb' : '#6b7280',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>👍</span>
                          <span>{comment.likeCount || 0}</span>
                        </button>
                      </div>
                    </div>
                    {editingCommentInputs[comment.id] !== undefined ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <input
                          type="text"
                          value={editingCommentInputs[comment.id]}
                          onChange={(e) => setEditingCommentInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                          style={{
                            flex: 1,
                            padding: '8px 10px',
                            border: '1px solid #d1d5db',
                            borderRadius: 8,
                            fontSize: '14px'
                          }}
                        />
                        <button
                          onClick={() => submitEditComment(post.id, comment.id)}
                          style={{
                            padding: '8px 12px',
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 600
                          }}
                        >
                          Gửi
                        </button>
                        <button
                          onClick={() => cancelEditComment(comment.id)}
                          style={{
                            padding: '8px 10px',
                            background: '#e5e7eb',
                            color: '#374151',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}

                    {commentPageInfo[post.id] && renderPagination(commentPageInfo[post.id], (page) => handleCommentPageChange(post.id, page))}

                    {/* Add Comment Input */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <input
                        type="text"
                        placeholder="Viết bình luận..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ 
                          ...prev, 
                          [post.id]: e.target.value 
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleComment(post.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '20px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        style={{
                          padding: '10px 20px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 500
                        }}
                      >
                        Gửi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {renderPagination(postPageInfo, handlePostPageChange)}
            </div>
          )}
        </main>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div
          className="register-overlay"
          onClick={(e) => { if (e.target.className === 'register-overlay') setShowCreateModal(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: 20
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>✍️ Tạo bài viết mới</h3>
              <button 
                onClick={() => setShowCreateModal(false)} 
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  fontSize: 24, 
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Tiêu đề bài viết"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                required
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />

              <textarea
                placeholder="Nội dung bài viết..."
                value={newPost.body}
                onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                required
                rows={6}
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  color: '#6b7280' 
                }}>
                  📷 Thêm ảnh (tùy chọn)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: submitting ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                >
                  {submitting ? 'Đang đăng...' : 'Đăng bài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
