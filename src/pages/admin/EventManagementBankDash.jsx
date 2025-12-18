import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, Users, Eye, X, Search, Check, XCircle
} from 'lucide-react';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { getAllEvents } from "../../services/eventService";
import { getDashboardOverview } from "../../services/dashboardService";
import '../../assets/styles/home.css';

const EventManagementBankDash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [overview, setOverview] = useState(null);

  // Fetch events from GraphQL findEvents
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEvents(0, 50);
      
      if (response.success && response.data) {
        const mapped = response.data.map(event => ({
          id: event.eventId,
          title: event.eventName || 'Sự kiện',
          description: event.eventDescription || '',
          location: event.eventLocation || 'Chưa xác định',
          startAt: event.createdAt,
          endAt: event.updatedAt,
          status: 'UNKNOWN', // schema không cung cấp trạng thái
          likeCount: event.likeCount || 0,
          creatorInfo: event.createBy || {},
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
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    fetchEvents();
    getOverview();
  }, [user]);

  const getOverview = async () => {
    const res = await getDashboardOverview(24, 5);
    if (res.success) {
      setOverview(res.data);
    }
  };

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
    pending: 0,
    accepted: 0,
    rejected: 0
  };

  const getStatusBadgeStyle = (status) => {
    return { bg: '#e5e7eb', text: '#374151' }; // không có trạng thái trong schema
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
            <p className="dashboard-subtitle">Dữ liệu từ GraphQL (findEvents, dashboardOverview)</p>
          </div>
        </div>

        {/* Statistics Section from dashboardOverview */}
        {overview && (
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
                <div className="stat-icon">🆕</div>
                <div className="stat-content">
                  <h3 className="stat-value">{overview.newlyPublished.length}</h3>
                  <p className="stat-label">Sự kiện mới</p>
                </div>
              </div>

              <div className="stat-card" style={{ '--accent-color': '#3b82f6' }}>
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <h3 className="stat-value">{overview.recentWithNewPosts.length}</h3>
                  <p className="stat-label">Có bài viết mới</p>
                </div>
              </div>

              <div className="stat-card" style={{ '--accent-color': '#f97316' }}>
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <h3 className="stat-value">{overview.trending.length}</h3>
                  <p className="stat-label">Đang thịnh hành</p>
                </div>
              </div>
            </div>
          </section>
        )}

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
              const isPending = event.status === 'PENDING';
              
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
                  
                  {isPending ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleApprove(event.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.875rem',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
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
                          padding: '0.875rem',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <XCircle className="w-5 h-5" />
                        Từ chối
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleViewPosts(event.id)}
                      className="event-join-btn"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Eye className="w-5 h-5" />
                      Xem chi tiết
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventManagementBankDash;
