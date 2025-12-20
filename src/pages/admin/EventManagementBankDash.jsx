import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, Users, Eye, Trash2, Check, XCircle
} from 'lucide-react';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { searchEvents, approveEvent, rejectEvent, deleteEvent } from "../../services/eventService";
import '../../assets/styles/home.css';

const EventManagementBankDash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('approved'); // approved | pending

  const buildFilter = (eventState) => ({
    keyword: null,
    categories: [],
    startDateFrom: null,
    startDateTo: null,
    location: null,
    eventState
  });

  // Fetch events tách đã duyệt/chưa duyệt theo eventState (searchEvents)
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const [approvedRes, pendingRes] = await Promise.all([
        searchEvents(buildFilter('ACCEPTED')),
        searchEvents(buildFilter('PENDING'))
      ]);

      if (approvedRes.success) {
        setApprovedEvents(
          (approvedRes.data || []).map(event => ({
            id: event.eventId,
            title: event.eventName || 'Sự kiện',
            description: event.eventDescription || '',
            location: event.eventLocation || 'Chưa xác định',
            startAt: event.createdAt,
            endAt: event.updatedAt,
            status: event.eventState || 'ACCEPTED',
            memberCount: event.memberCount || 0,
            postCount: event.postCount || 0,
            categories: event.categories || [],
            likeCount: event.likeCount || 0,
            creatorInfo: event.createBy || {},
            createdAt: event.createdAt || new Date().toISOString()
          }))
        );
      } else {
        setApprovedEvents([]);
      }

      if (pendingRes.success) {
        setPendingEvents(
          (pendingRes.data || []).map(event => ({
            id: event.eventId,
            title: event.eventName || 'Sự kiện',
            description: event.eventDescription || '',
            location: event.eventLocation || 'Chưa xác định',
            startAt: event.createdAt,
            endAt: event.updatedAt,
            status: event.eventState || 'PENDING',
            memberCount: event.memberCount || 0,
            postCount: event.postCount || 0,
            categories: event.categories || [],
            likeCount: event.likeCount || 0,
            creatorInfo: event.createBy || {},
            createdAt: event.createdAt || new Date().toISOString()
          }))
        );
      } else {
        setPendingEvents([]);
      }

      if (!approvedRes.success || !pendingRes.success) {
        setError(approvedRes.error || pendingRes.error || "Không thể tải danh sách sự kiện");
      }
    } catch (error) {
      setApprovedEvents([]);
      setPendingEvents([]);
      setError(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
      showNotification("Không thể tải danh sách sự kiện", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    const res = await approveEvent(eventId);
    if (res.success) {
      showNotification(res.message || 'Đã duyệt sự kiện', 'success');
      fetchEvents();
    } else {
      showNotification(res.error || 'Không thể duyệt sự kiện', 'error');
    }
  };

  const handleReject = async (eventId) => {
    const res = await rejectEvent(eventId);
    if (res.success) {
      showNotification(res.message || 'Đã từ chối sự kiện', 'success');
      fetchEvents();
    } else {
      showNotification(res.error || 'Không thể từ chối sự kiện', 'error');
    }
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm('Xóa sự kiện này? Hành động không thể hoàn tác.');
    if (!confirmed) return;
    const res = await deleteEvent(eventId);
    if (res.success) {
      showNotification(res.message || 'Đã xóa sự kiện', 'success');
      fetchEvents();
    } else {
      showNotification(res.error || 'Không thể xóa sự kiện', 'error');
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    fetchEvents();
  }, [user]);

  const getStatusBadgeStyle = (status) => {
    const map = {
      PENDING: { bg: '#fef3c7', text: '#92400e' },
      ACCEPTED: { bg: '#d1fae5', text: '#065f46' },
    };
    return map[status] || { bg: '#e5e7eb', text: '#374151' };
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

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header */}
        <div className="main-header">
          <div>
            <h1 className="dashboard-title">Quản Lý Sự Kiện (Admin) 🛠️</h1>
            <p className="dashboard-subtitle">Danh sách sự kiện</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('approved')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: activeTab === 'approved' ? '1px solid #3b82f6' : '1px solid #e5e7eb',
              background: activeTab === 'approved' ? '#eff6ff' : '#fff',
              color: activeTab === 'approved' ? '#1d4ed8' : '#111827',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Đã duyệt ({approvedEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: activeTab === 'pending' ? '1px solid #10b981' : '1px solid #e5e7eb',
              background: activeTab === 'pending' ? '#ecfdf3' : '#fff',
              color: activeTab === 'pending' ? '#065f46' : '#111827',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Chờ duyệt ({pendingEvents.length})
          </button>
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
        ) : (
          (() => {
            const isPendingTab = activeTab === 'pending';
            const list = isPendingTab ? pendingEvents : approvedEvents;
            const title = isPendingTab ? 'Sự kiện chưa duyệt' : 'Sự kiện đã duyệt';
            const badgeLabel = isPendingTab ? '⏳ Chờ duyệt' : '✅ Đã duyệt';
            return (
              <section>
                <div className="main-header" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>{title}</h3>
                  <span style={{ color: '#6b7280' }}>{list.length} sự kiện</span>
                </div>
                {list.length === 0 ? (
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    border: '1px dashed #e5e7eb',
                    color: '#6b7280'
                  }}>
                    Không có sự kiện {isPendingTab ? 'chờ duyệt' : 'đã duyệt'}.
                  </div>
                ) : (
                  <div className="events-grid admin-events-grid">
                    {list.map((event) => {
                      const badge = getStatusBadgeStyle(event.status);
                      return (
                        <div key={event.id} className="event-card-modern">
                          <div 
                            className="event-badge"
                            style={{ backgroundColor: badge.bg, color: badge.text }}
                          >
                            {badgeLabel}
                          </div>
                          
                          <h3 className="event-title">{event.title}</h3>
                          
                          <p className="event-description">
                            {event.description?.substring(0, 120)}
                            {(event.description || '').length > 120 && '...'}
                          </p>
                          
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
                            {event.memberCount || 0} thành viên
                          </span>
                          <span className="meta-item">
                            📝 {event.postCount || 0} bài viết
                          </span>
                          <span className="meta-item">
                            👍 {event.likeCount || 0} lượt thích
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
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            {isPendingTab ? (
                              <>
                                <button 
                                  onClick={() => handleApprove(event.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Check className="w-5 h-5" />
                                  Duyệt
                                </button>
                                <button 
                                  onClick={() => handleReject(event.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <XCircle className="w-5 h-5" />
                                  Từ chối
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleViewPosts(event.id)}
                                  className="event-join-btn"
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                  <Eye className="w-5 h-5" />
                                  Xem chi tiết
                                </button>
                                <button 
                                  onClick={() => handleDelete(event.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Trash2 className="w-5 h-5" />
                                  Xóa sự kiện
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })()
        )}
      </main>
    </div>
  );
};

export default EventManagementBankDash;
