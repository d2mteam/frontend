import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/Sidebar";
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import { showNotification as showToast } from '../../services/toastService';
import '../../assets/styles/events.css';

export default function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications(filter === 'unread');
      
      if (response.success) {
        const mapped = response.data.notifications.map(notif => ({
          id: notif._id,
          title: notif.title,
          time: getTimeAgo(notif.createdAt),
          body: notif.message,
          type: notif.type,
          isRead: notif.isRead,
          relatedEvent: notif.relatedEvent?._id,
          eventTitle: notif.relatedEvent?.title,
          sender: notif.sender?.name,
          createdAt: notif.createdAt
        }));
        
        setNotifications(mapped);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showToast('Không thể tải thông báo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast('Đã đánh dấu tất cả là đã đọc', 'success');
    } catch (error) {
      showToast('Không thể đánh dấu', 'error');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_created': return '📅';
      case 'event_approved': return '✅';
      case 'event_rejected': return '❌';
      case 'registration_new': return '🙋';
      case 'registration_approved': return '✅';
      case 'registration_rejected': return '❌';
      case 'post_new': return '📝';
      case 'comment_new': return '💬';
      case 'like_new': return '❤️';
      case 'event_completed': return '🎉';
      default: return '📢';
    }
  };

  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Thông báo</h2>
              {unreadCount > 0 && (
                <span style={{ 
                  background: '#ef4444', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  marginLeft: '8px'
                }}>
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                style={{ 
                  padding: '6px 12px', 
                  background: filter === 'unread' ? '#3b82f6' : '#e5e7eb',
                  color: filter === 'unread' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {filter === 'all' ? '📬 Chưa đọc' : '📭 Tất cả'}
              </button>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  style={{ 
                    padding: '6px 12px', 
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  ✓ Đọc tất cả
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading">Đang tải thông báo...</div>
          ) : notifications.length === 0 ? (
            <div className="loading">
              {filter === 'unread' ? 'Không có thông báo chưa đọc.' : 'Không có thông báo.'}
            </div>
          ) : (
            <div className="event-list">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className="event-card event-vol" 
                  style={{ 
                    cursor: 'pointer',
                    background: n.isRead ? 'white' : '#f0f9ff',
                    borderLeft: n.isRead ? '3px solid transparent' : '3px solid #3b82f6'
                  }}
                  onClick={() => {
                    if (!n.isRead) handleMarkAsRead(n.id);
                    if (n.relatedEvent) navigate(`/eventPosts/${n.relatedEvent}`);
                  }}
                >
                  <div className="event-title-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{getNotificationIcon(n.type)}</span>
                      <span className="event-title" style={{ cursor: 'pointer' }}>
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          background: '#3b82f6', 
                          borderRadius: '50%' 
                        }} />
                      )}
                    </div>
                    <span className="event-date">{n.time}</span>
                  </div>

                  <div className="event-desc" style={{ marginTop: 6 }}>
                    {n.body}
                  </div>

                  {n.eventTitle && (
                    <div style={{ marginTop: '8px', fontSize: '13px', color: '#3b82f6', fontWeight: 500 }}>
                      📌 Sự kiện: {n.eventTitle}
                    </div>
                  )}

                  {n.sender && (
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                      Từ: {n.sender}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}