import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Search, Filter, X, Eye } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { getAllEvents, registerForEvent, getMyRegisteredEventIds } from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import '../assets/styles/home.css';

export default function Events() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

  // 🔥 UTILITY: Chuẩn hóa ID (Luôn convert sang String)
  const normalizeId = (id) => {
    if (id === null || id === undefined) return null;
    return String(id);
  };

  const categories = [
    { value: 'all', label: 'Tất cả', icon: '📋' },
    { value: 'environment', label: 'Môi trường', icon: '🌱' },
    { value: 'education', label: 'Giáo dục', icon: '📚' },
    { value: 'healthcare', label: 'Y tế', icon: '🏥' },
    { value: 'community', label: 'Cộng đồng', icon: '🤝' },
    { value: 'children', label: 'Trẻ em', icon: '👶' },
    { value: 'elderly', label: 'Người già', icon: '👴' },
    { value: 'disaster', label: 'Thiên tai', icon: '🆘' },
    { value: 'other', label: 'Khác', icon: '📌' }
  ];

  // FIX 1: Chỉ fetch Events 1 lần khi mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // FIX 2: Fetch registered IDs mỗi khi user thay đổi (đăng nhập/F5 reload lấy được user)
  useEffect(() => {
    if (user) {
      loadRegisteredEventIds();
    } else {
      setRegisteredEventIds(new Set()); // Reset nếu logout
    }
  }, [user]);

  const loadRegisteredEventIds = async () => {
    if (!user) {
      console.log('⚠️ User chưa sẵn sàng, bỏ qua load registered IDs');
      setRegisteredEventIds(new Set());
      return;
    }
    
    try {
      console.log('🔄 Bắt đầu load danh sách sự kiện đã đăng ký...');
      const response = await getMyRegisteredEventIds();
      
      // Xử lý an toàn dữ liệu trả về
      let ids = [];
      if (Array.isArray(response)) {
        ids = response;
      } else if (response?.success && Array.isArray(response.data)) {
        ids = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        ids = response.data;
      }
      
      // 🔥 CHUẨN HÓA: Convert tất cả sang String để so sánh chính xác
      const normalizedIds = ids.map(id => normalizeId(id)).filter(id => id !== null);
      setRegisteredEventIds(new Set(normalizedIds));
      
      console.log('✅ Loaded registered event IDs:', normalizedIds);
      console.log('📊 Số sự kiện đã đăng ký:', normalizedIds.length);
    } catch (error) {
      console.error('❌ Error loading registered event IDs:', error);
      setRegisteredEventIds(new Set()); // Fallback to empty Set
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents(0, 100);
      
      if (response.success && response.data) {
        const mapped = response.data.map(event => ({
          id: event.eventId,
          eventName: event.eventName || 'Sự kiện',
          eventDescription: event.eventDescription || '',
          eventLocation: event.eventLocation || 'Chưa xác định',
          eventState: event.eventState || 'PENDING',
          memberCount: event.memberCount || 0,
          createdAt: event.createdAt,
          startTime: event.startTime,
          endAt: event.endAt,
          metadata: event.metadata || {},
          creatorInfo: event.creatorInfo || {}
        }));
        setEvents(mapped);
      } else {
        setEvents([]);
      }
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventCategory = (event) => {
    const metadata = event.metadata || {};
    if (metadata.category) return metadata.category;
    
    const text = `${event.eventName} ${event.eventDescription}`.toLowerCase();
    if (text.includes('môi trường') || text.includes('cây xanh')) return 'environment';
    if (text.includes('giáo dục') || text.includes('học')) return 'education';
    if (text.includes('y tế') || text.includes('sức khỏe')) return 'healthcare';
    if (text.includes('cộng đồng')) return 'community';
    if (text.includes('trẻ em')) return 'children';
    if (text.includes('người già')) return 'elderly';
    if (text.includes('thiên tai')) return 'disaster';
    return 'other';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm.trim() || 
      event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventLocation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || event.eventState === statusFilter;

    const now = new Date();
    const eventDate = new Date(event.createdAt);
    const daysDiff = Math.floor((now - eventDate) / (1000 * 60 * 60 * 24));
    let matchesTime = true;
    
    if (timeFilter === 'today') matchesTime = daysDiff === 0;
    else if (timeFilter === 'week') matchesTime = daysDiff <= 7;
    else if (timeFilter === 'month') matchesTime = daysDiff <= 30;
    else if (timeFilter === 'upcoming') matchesTime = daysDiff >= -7 && daysDiff <= 0;

    const eventCategory = getEventCategory(event);
    const matchesCategory = categoryFilter === 'all' || eventCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesTime && matchesCategory;
  });

  const getCategoryCounts = () => {
    const counts = {};
    categories.forEach(cat => {
      counts[cat.value] = cat.value === 'all' 
        ? events.length 
        : events.filter(e => getEventCategory(e) === cat.value).length;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const handleRegister = async (eventId) => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để đăng ký sự kiện', 'warning');
      navigate('/dashboard');
      return;
    }

    const normalizedEventId = normalizeId(eventId);
    console.log('🔄 Bắt đầu đăng ký sự kiện ID:', normalizedEventId);

    try {
      setRegisteringEventId(eventId);
      const response = await registerForEvent(eventId);
      
      if (response.success) {
        console.log('✅ Đăng ký thành công! Event ID:', normalizedEventId);
        showNotification('✅ Đăng ký sự kiện thành công!', 'success');
        
        // 🔥 OPTIMISTIC UPDATE: Cập nhật UI ngay lập tức
        setRegisteredEventIds(prev => {
          const newSet = new Set(prev);
          newSet.add(normalizedEventId);
          console.log('📊 Updated registered IDs:', Array.from(newSet));
          return newSet;
        });
        
        // Refresh danh sách sự kiện để cập nhật memberCount
        fetchEvents();
      } else {
        // 🔥 XỬ LÝ TRƯỜNG HỢP "ĐÃ ĐĂNG KÝ RỒI"
        const errorMessage = (response.message || '').toLowerCase();
        const isAlreadyRegistered = 
          errorMessage.includes('already registered') ||
          errorMessage.includes('đã đăng ký') ||
          errorMessage.includes('already exists') ||
          errorMessage.includes('duplicate');
        
        if (isAlreadyRegistered) {
          console.log('⚠️ Phát hiện: User đã đăng ký rồi. Đồng bộ trạng thái...');
          
          // Đồng bộ state: Thêm ID vào Set
          setRegisteredEventIds(prev => {
            const newSet = new Set(prev);
            newSet.add(normalizedEventId);
            console.log('🔄 Sync state - Added ID:', normalizedEventId);
            return newSet;
          });
          
          // Hiện thông báo thân thiện
          showNotification('ℹ️ Bạn đã đăng ký sự kiện này rồi!', 'info');
          
          // Refresh để cập nhật UI
          fetchEvents();
        } else {
          // Lỗi thật sự khác
          console.error('❌ Đăng ký thất bại:', response.message);
          showNotification(response.message || 'Không thể đăng ký sự kiện', 'error');
        }
      }
    } catch (error) {
      console.error('❌ Exception khi đăng ký:', error);
      
      // 🔥 KIỂM TRA LỖI NETWORK CÓ MESSAGE "ALREADY REGISTERED"
      const errorMessage = (error?.response?.data?.message || error?.message || '').toLowerCase();
      const isAlreadyRegistered = 
        errorMessage.includes('already registered') ||
        errorMessage.includes('đã đăng ký') ||
        errorMessage.includes('already exists');
      
      if (isAlreadyRegistered) {
        console.log('⚠️ Exception nhưng phát hiện: Đã đăng ký. Sync state...');
        
        setRegisteredEventIds(prev => {
          const newSet = new Set(prev);
          newSet.add(normalizedEventId);
          return newSet;
        });
        
        showNotification('ℹ️ Bạn đã đăng ký sự kiện này rồi!', 'info');
        fetchEvents();
      } else {
        showNotification('Đã xảy ra lỗi khi đăng ký', 'error');
      }
    } finally {
      setRegisteringEventId(null);
    }
  };

  const viewEventDetails = (eventId) => {
    navigate(`/eventPosts/${eventId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  const stats = {
    total: events.length,
    active: events.filter(e => e.eventState === 'ACCEPTED').length,
    pending: events.filter(e => e.eventState === 'PENDING').length,
    completed: events.filter(e => e.eventState === 'COMPLETED').length
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACCEPTED: { bg: '#d1fae5', color: '#065f46', label: '🎯 Đang hoạt động' },
      PENDING: { bg: '#fef3c7', color: '#92400e', label: '⏳ Chờ duyệt' },
      COMPLETED: { bg: '#dbeafe', color: '#1e40af', label: '✅ Hoàn thành' },
      CANCELLED: { bg: '#fee2e2', color: '#991b1b', label: '❌ Đã hủy' }
    };
    return badges[status] || badges.PENDING;
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <div className="main-header">
          <div>
            <h1 className="dashboard-title">Khám Phá Sự Kiện Tình Nguyện 🎯</h1>
            <p className="dashboard-subtitle">
              Tham gia cùng cộng đồng để tạo nên những thay đổi tích cực
            </p>
          </div>
        </div>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.total}</h3>
                <p className="stat-label">Tổng sự kiện</p>
              </div>
            </div>
            <div className="stat-card" style={{ '--accent-color': '#3b82f6' }}>
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.active}</h3>
                <p className="stat-label">Đang hoạt động</p>
              </div>
            </div>
            <div className="stat-card" style={{ '--accent-color': '#f59e0b' }}>
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.pending}</h3>
                <p className="stat-label">Chờ duyệt</p>
              </div>
            </div>
            <div className="stat-card" style={{ '--accent-color': '#8b5cf6' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.completed}</h3>
                <p className="stat-label">Hoàn thành</p>
              </div>
            </div>
          </div>
        </section>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b', marginRight: '0.5rem' }}>Danh mục:</span>
            {categories.map(cat => (
              <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                  background: categoryFilter === cat.value ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'white',
                  color: categoryFilter === cat.value ? 'white' : '#475569',
                  border: categoryFilter === cat.value ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: categoryFilter === cat.value ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
                }}>
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{
                  background: categoryFilter === cat.value ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  padding: '0.125rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem'
                }}>{categoryCounts[cat.value]}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '20px', height: '20px' }} />
              <input type="text" placeholder="Tìm kiếm sự kiện theo tên, địa điểm..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', paddingLeft: '3rem', padding: '0.875rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }} />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button className="btn-home-dropdown" onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} />
              {showFilters ? 'Ẩn bộ lọc' : 'Lọc nâng cao'}
            </button>
          </div>

          {showFilters && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Trạng thái</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}>
                  <option value="all">Tất cả</option>
                  <option value="ACCEPTED">🎯 Đang hoạt động</option>
                  <option value="PENDING">⏳ Chờ duyệt</option>
                  <option value="COMPLETED">✅ Hoàn thành</option>
                  <option value="CANCELLED">❌ Đã hủy</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Thời gian</label>
                <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}>
                  <option value="all">Tất cả</option>
                  <option value="upcoming">🔜 Sắp diễn ra</option>
                  <option value="today">📅 Hôm nay</option>
                  <option value="week">📆 7 ngày qua</option>
                  <option value="month">📅 30 ngày qua</option>
                </select>
              </div>
              <button onClick={() => { setStatusFilter('all'); setTimeFilter('all'); setCategoryFilter('all'); setSearchTerm(''); }}
                style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '10px', fontWeight: 600, color: '#475569', cursor: 'pointer', alignSelf: 'end' }}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        <section className="events-section">
          <div className="section-header">
            <h2 className="section-title">Danh sách sự kiện ({filteredEvents.length})</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ width: '50px', height: '50px', border: '4px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
              <p style={{ color: '#64748b' }}>Đang tải sự kiện...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
              <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Không tìm thấy sự kiện</h3>
              <p style={{ color: '#64748b' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => {
                const category = getEventCategory(event);
                const categoryInfo = categories.find(c => c.value === category) || categories[0];
                const badge = getStatusBadge(event.eventState);
                
                return (
                  <div key={event.id} className="event-card-modern">
                    <div className="event-badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
                      {badge.label}
                    </div>

                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
                      <span>{categoryInfo.icon}</span>
                      <span>{categoryInfo.label}</span>
                    </div>

                    <h3 className="event-title">{event.eventName}</h3>
                    <p className="event-description">
                      {event.eventDescription.substring(0, 120)}
                      {event.eventDescription.length > 120 && '...'}
                    </p>

                    <div className="event-meta">
                      <span className="meta-item">
                        <MapPin className="w-4 h-4" />
                        {event.eventLocation}
                      </span>
                      <span className="meta-item">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.startTime || event.createdAt)}
                      </span>
                      <span className="meta-item">
                        <Users className="w-4 h-4" />
                        {event.memberCount} người
                      </span>
                    </div>

                    {event.creatorInfo?.fullName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Tổ chức bởi:</span>
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>{event.creatorInfo.fullName}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => viewEventDetails(event.id)}
                        className="event-join-btn"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem',
                          background: '#e2e8f0',
                          color: '#1e293b',
                          border: '1px solid #cbd5e1',
                          flex: 1
                        }}
                      >
                        <Eye className="w-5 h-5" />
                        Xem chi tiết
                      </button>

                      <button 
                        className="event-join-btn" 
                        onClick={() => handleRegister(event.id)}
                        disabled={registeringEventId === event.id || event.eventState !== 'ACCEPTED'}
                        style={{
                          opacity: event.eventState !== 'ACCEPTED' ? 0.6 : 1,
                          cursor: event.eventState !== 'ACCEPTED' ? 'not-allowed' : 'pointer',
                          flex: 1
                        }}
                      >
                        {registeringEventId === event.id ? (
                          <>
                            <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                            Đang xử lý...
                          </>
                        ) : event.eventState !== 'ACCEPTED' ? '🔒 Không khả dụng' : '✅ Xác nhận đăng ký'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
