import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import { getAllEvents } from '../../services/eventService';
import { getDashboardOverview } from '../../services/dashboardService';
import '../../assets/styles/home.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [hours, setHours] = useState(24);

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role, hours]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const overviewRes = await getDashboardOverview(hours, 10);

      const data = overviewRes.success && overviewRes.data ? overviewRes.data : sampleOverview;
      setOverview(data);

      if (overviewRes.success || data) {
        const mappedStats = [
          { id: 1, label: 'Sự kiện mới', value: data?.newlyPublished?.length || 0, icon: '🆕', color: '#10b981' },
          { id: 2, label: 'Có bài viết mới', value: data?.recentWithNewPosts?.length || 0, icon: '💬', color: '#3b82f6' },
          { id: 3, label: 'Đang thịnh hành', value: data?.trending?.length || 0, icon: '🔥', color: '#f59e0b' }
        ];
        setStats(mappedStats);
        const activities = [
          ...(data?.recentWithNewPosts || []).map((e, idx) => ({
            id: `post-${idx}`,
            activity: `${e.event.eventName}: +${e.newPostCount} bài viết`,
            date: e.latestPostAt ? formatDate(e.latestPostAt) : '',
            status: 'success'
          }))
        ];
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats([
        { id: 1, label: 'Tổng Sự Kiện', value: '0', icon: '📅', color: '#10b981' },
        { id: 2, label: 'Thành Viên', value: '0', icon: '👥', color: '#3b82f6' },
        { id: 3, label: 'Bài Viết', value: '0', icon: '📝', color: '#f59e0b' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content" id="main-content">
        <header className="main-header">
          <div>
            <h1 className="dashboard-title">Chào mừng đến với Dashboard! 👋</h1>
            <p className="dashboard-subtitle">Tổng quan hoạt động tình nguyện</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ fontWeight: 500, color: '#374151' }}>Khoảng thời gian:</label>
            {[1, 8, 24, 72].map(h => (
              <button
                key={h}
                onClick={() => setHours(h)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: hours === h ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  background: hours === h ? '#eff6ff' : '#fff',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                {h}h
              </button>
            ))}
          </div>

          <div className="user-info">
            <span className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </span>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Người dùng'}</span>
              <span className="user-role">
                {user?.role === 'volunteer' ? 'Tình nguyện viên' : 
                 user?.role === 'manager' ? 'Quản lý' : 
                 user?.role === 'ADMIN' ? 'Quản trị viên' : 'Tình nguyện viên'}
              </span>
            </div>
            <div className="user-dropdown">
              <button 
                className="btn-home-dropdown" 
                onClick={() => navigate('/')}
              >
                <span>🏠</span>
                <span>Quay về trang chủ</span>
              </button>
            </div>
          </div>
        </header>

        <section className="stats-section" style={{ marginTop: 8 }}>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="stat-card" style={{ '--accent-color': stat.color }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {overview?.recentWithNewPosts?.length > 0 && (
          <section className="activities-section">
            <div className="section-header">
              <h2 className="section-title">Có bài viết mới</h2>
            </div>
            <div className="table-container">
              <table className="activities-table">
                <thead>
                  <tr>
                    <th>Sự kiện</th>
                    <th>Số bài mới</th>
                    <th>Gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentWithNewPosts.slice(0, 6).map((item, idx) => (
                    <tr key={idx}>
                      <td className="activity-name">{item.event.eventName}</td>
                      <td className="date-cell">+{item.newPostCount}</td>
                      <td className="date-cell">
                        {item.latestPostAt ? new Date(item.latestPostAt).toLocaleDateString('vi-VN') : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {overview?.newlyPublished?.length > 0 && (
          <section className="events-section">
            <div className="section-header" style={{ marginBottom: 10 }}>
              <h2 className="section-title">Sự kiện mới</h2>
            </div>
            <div className="events-grid">
              {overview.newlyPublished.slice(0, 6).map((event, idx) => (
                <div key={idx} className="event-card-modern dashboard-event-card">
                  <div className="event-badge">Mới</div>
                  <h3 className="event-title">{event.eventName}</h3>
                  <p className="event-description">{event.eventDescription || 'Không có mô tả'}</p>
                  <div className="event-meta">
                    <span className="meta-item">📍 {event.eventLocation || 'N/A'}</span>
                  </div>
                  <button className="event-join-btn" onClick={() => navigate(`/eventPosts/${event.eventId}`)}>
                    Xem sự kiện
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {overview?.trending?.length > 0 && (
          <section className="events-section">
            <div className="section-header">
              <h2 className="section-title">Sự kiện thịnh hành</h2>
            </div>
            <div className="events-grid">
              {overview.trending.slice(0, 6).map((item, idx) => (
                <div key={idx} className="event-card-modern dashboard-event-card">
                  <div className="event-badge featured">Trending</div>
                  <h3 className="event-title">{item.event.eventName}</h3>
                  <p className="event-description">{item.event.eventDescription || 'Không có mô tả'}</p>
                  <div className="event-meta">
                    <span className="meta-item">+{item.newMemberCount} thành viên</span>
                    <span className="meta-item">+{item.newCommentCount} bình luận</span>
                    <span className="meta-item">+{item.newLikeCount} like</span>
                  </div>
                  <button className="event-join-btn" onClick={() => navigate(`/eventPosts/${item.event.eventId}`)}>
                    Xem sự kiện
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
