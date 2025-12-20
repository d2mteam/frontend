import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, Users, Eye, X, Search, Plus
} from 'lucide-react';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { getManagerEvents, createEvent, updateEvent, deleteEvent } from "../../services/eventService";
import '../../assets/styles/home.css';

export default function EventManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDescription: '',
    eventLocation: '',
    categories: [],
    categoriesInput: ''
  });

  // Fetch events created/managed by this manager (tạm dùng findEvents)
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getManagerEvents(0, 100);
      
      if (response.success && response.data) {
        const mapped = response.data.map(event => ({
          id: event.eventId,
          title: event.eventName || 'Sự kiện',
          description: event.eventDescription || '',
          location: event.eventLocation || 'Chưa xác định',
          startAt: event.createdAt,
          endAt: event.updatedAt,
          status: event.eventState || event.event_state || 'PENDING',
          memberCount: event.memberCount || 0,
          postCount: event.postCount || 0,
          likeCount: event.likeCount || 0,
          categories: event.categories || [],
          creatorName: event.createBy?.fullName || event.createBy?.username || 'Ẩn danh',
          creatorUsername: event.createBy?.username || '',
          creatorId: event.createBy?.userId || '',
          createdAt: event.createdAt || new Date().toISOString()
        }));
        setEvents(mapped);
      } else {
        setEvents([]);
        setError(response.error || "Không thể tải danh sách sự kiện");
      }
    } catch (error) {
      setEvents([]);
      setError(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
      showNotification("Không thể tải danh sách sự kiện", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "EVENT_MANAGER") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "EVENT_MANAGER") return;
    fetchEvents();
  }, [user]);

  // Filter logic
  const filteredEvents = () => {
    let filtered = events;
    
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(e => e.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Stats calculation
  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'PENDING').length,
    accepted: events.filter(e => e.status === 'ACCEPTED' || e.status === 'UPCOMING').length,
    rejected: events.filter(e => e.status === 'REJECTED').length
  };

  const getStatusBadgeStyle = (status) => {
    const map = {
      PENDING: { bg: '#fef3c7', text: '#92400e' },
      ACCEPTED: { bg: '#d1fae5', text: '#065f46' },
      UPCOMING: { bg: '#d1fae5', text: '#065f46' },
      REJECTED: { bg: '#fee2e2', text: '#991b1b' }
    };
    return map[status] || map.PENDING;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const handleViewPosts = (eventId) => {
    navigate(`/eventPosts/${eventId}`);
  };

  const handleManageMembers = (eventId) => {
    navigate(`/event-manager/events/${eventId}/manage`);
  };

  const handleEdit = (event) => {
    setNewEvent({
      eventName: event.title || event.eventName || '',
      eventDescription: event.description || event.eventDescription || '',
      eventLocation: event.location || event.eventLocation || '',
      categories: event.categories || [],
      categoriesInput: (event.categories || []).join(', ')
    });
    setEditingEventId(event.id);
    setShowCreateModal(true);
  };

  const handleDelete = async (eventId) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa sự kiện này?");
    if (!confirm) return;
    const res = await deleteEvent(eventId);
    if (res.success) {
      showNotification("Đã xóa sự kiện", "success");
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } else {
      showNotification(res.error || "Không thể xóa sự kiện", "error");
    }
  };

  const handleCreateEvent = async () => {
    const isEditing = Boolean(editingEventId);
    try {
      if (!newEvent.eventName || !newEvent.eventDescription || !newEvent.eventLocation) {
        showNotification('Vui l\u00f2ng đi\u1ec1n đầy đủ th\u00f4ng tin!', 'error');
        return;
      }

      const input = {
        eventName: newEvent.eventName.trim(),
        eventDescription: newEvent.eventDescription.trim(),
        eventLocation: newEvent.eventLocation.trim(),
        categories: (newEvent.categoriesInput || '')
          .split(',')
          .map(c => c.trim())
          .filter(Boolean)
      };

      const response = isEditing ? await updateEvent(editingEventId, input) : await createEvent(input);
      if (response.success) {
        showNotification(isEditing ? 'C\u1eadp nh\u1eadt s\u1ef1 ki\u1ec7n th\u00e0nh c\u00f4ng!' : 'S\u1ef1 ki\u1ec7n \u0111\u00e3 \u0111\u01b0\u1ee3c t\u1ea1o v\u00e0 \u0111ang ch\u1edd duy\u1ec7t!', 'success');
        setShowCreateModal(false);
        setEditingEventId(null);
        setNewEvent({
          eventName: '',
          eventDescription: '',
          eventLocation: '',
          categories: [],
          categoriesInput: ''
        });
        fetchEvents();
      } else {
        showNotification(response.error || 'Kh\u00f4ng th\u1ec3 t\u1ea1o s\u1ef1 ki\u1ec7n', 'error');
      }
    } catch (error) {
      showNotification('L\u1ed7i khi t\u1ea1o s\u1ef1 ki\u1ec7n', 'error');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header */}
        <div className="main-header">
          <div>
            <h1 className="dashboard-title">Quản Lý Sự Kiện</h1>
            <p className="dashboard-subtitle">Tạo và quản lý các sự kiện của bạn</p>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-home-dropdown"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus className="w-5 h-5" />
            <span>Tạo Sự Kiện Mới</span>
          </button>
        </div>

        {/* Statistics Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.total}</h3>
                <p className="stat-label">Tổng sự kiện</p>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#f59e0b' }}>
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.pending}</h3>
                <p className="stat-label">Chờ duyệt</p>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.accepted}</h3>
                <p className="stat-label">Đã duyệt</p>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#ef4444' }}>
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.rejected}</h3>
                <p className="stat-label">Bị từ chối</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  width: '20px',
                  height: '20px'
                }} 
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mô tả, địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  padding: '0.875rem 1.25rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.875rem 1.25rem',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">⏳ Chờ duyệt</option>
              <option value="ACCEPTED">✅ Đã duyệt</option>
              <option value="UPCOMING">🚀 Sắp tới</option>
              <option value="REJECTED">❌ Bị từ chối</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <X className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '3rem', 
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <p style={{ color: '#64748b' }}>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '3rem', 
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <p style={{ color: '#ef4444', marginBottom: '0.5rem' }}>⚠️ Đã xảy ra lỗi</p>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{error}</p>
          </div>
        ) : filteredEvents().length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '3rem', 
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</p>
            <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Không tìm thấy sự kiện</h3>
            <p style={{ color: '#64748b' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents().map((event) => {
              const badge = getStatusBadgeStyle(event.status);
              const isOwner = event.creatorId && event.creatorId === user?.userId;
              
              return (
                <div key={event.id} className="event-card-modern">
                  <div 
                    className="event-badge"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {event.status === 'PENDING' && '⏳ Chờ duyệt'}
                    {event.status === 'ACCEPTED' && '✅ Đã duyệt'}
                    {event.status === 'UPCOMING' && '🚀 Sắp tới'}
                    {event.status === 'REJECTED' && '❌ Bị từ chối'}
                  </div>
                  
                  <h3 className="event-title">{event.title}</h3>
                  
                  <p className="event-description">
                    {event.description.substring(0, 100)}
                    {event.description.length > 100 && '...'}
                  </p>
                  
                  <div className="event-meta" style={{ marginTop: '-0.5rem' }}>
                    <span className="meta-item">
                      👤 Người tạo: {event.creatorName || 'Ẩn danh'}
                    </span>
                  </div>

                  <div className="event-meta">
                    <span className="meta-item">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span className="meta-item">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.startAt)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span className="meta-item">
                      <Users className="w-4 h-4" />
                      {event.memberCount} thành viên
                    </span>
                    <span className="meta-item">
                      📝 {event.postCount} bài viết
                    </span>
                  </div>
                  {event.categories && event.categories.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                      {event.categories.map((c) => (
                        <span key={c} style={{ padding: '4px 10px', borderRadius: 999, background: '#eef2ff', color: '#4338ca', fontSize: '12px' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => handleViewPosts(event.id)}
                    className="event-join-btn"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Eye className="w-5 h-5" />
                    Xem chi tiết
                  </button>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    {isOwner && (
                      <>
                        <button
                          onClick={() => handleEdit(event)}
                          className="event-join-btn"
                          style={{
                            flex: 1,
                            background: '#f1f5f9',
                            color: '#111827',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleManageMembers(event.id)}
                          className="event-join-btn"
                          style={{ flex: 1 }}
                        >
                          Quản lý
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="event-join-btn"
                          style={{ flex: 1, background: '#dc2626' }}
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>
                {editingEventId ? 'Sửa Sự Kiện' : 'Tạo Sự Kiện Mới'}
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>
                  Tên sự kiện
                </label>
                <input
                  type="text"
                  value={newEvent.eventName}
                  onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Nhập tên sự kiện"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>
                  Mô tả
                </label>
                <textarea
                  value={newEvent.eventDescription}
                  onChange={(e) => setNewEvent({...newEvent, eventDescription: e.target.value})}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    resize: 'vertical'
                  }}
                  placeholder="Nhập mô tả sự kiện"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>
                  Danh mục (phân tách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newEvent.categoriesInput}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    categoriesInput: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Ví dụ: Tình nguyện, Môi trường"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={newEvent.eventLocation}
                  onChange={(e) => setNewEvent({...newEvent, eventLocation: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                  placeholder="Nhập địa điểm"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateEvent}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {editingEventId ? 'Lưu thay đổi' : 'Tạo Sự Kiện'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
