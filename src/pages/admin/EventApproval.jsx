import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/unified-dashboard.css';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useEvents } from "../../contexts/EventContext";
import { useNotification } from "../../contexts/NotificationContext";

function EventApproval() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { approvedEvents, pendingEvents, approveEvent, rejectEvent, deleteEvent } = useEvents();
    const { showNotification } = useNotification();

    // Check if user has admin role
    useEffect(() => {
      if (!user) {
        return; // Wait for user to load
      }
      if (user.role !== 'ADMIN') {
        navigate('/');
        return;
      }
    }, [user, navigate]);

    const handlePosts = () => {
      navigate('/eventPosts');
    };

  const [activeTab, setActiveTab] = useState("pending");

  // Combine approved and pending events for admin view
  const allEvents = [
    ...approvedEvents.map(e => ({ ...e, approvalStatus: 'approved' })),
    ...pendingEvents.map(e => ({ ...e, approvalStatus: 'pending' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Lọc sự kiện theo tab hiện tại
  const filteredEvents = activeTab === "all" 
    ? allEvents 
    : allEvents.filter(e => e.approvalStatus === activeTab);

  // Xử lý phê duyệt
  const handleApprove = (eventId) => {
    const result = approveEvent(eventId, user?.id);
    showNotification(result.message, result.success ? 'success' : 'error');
  };

  // Xử lý từ chối
  const handleReject = (eventId) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối sự kiện này?")) {
      const result = rejectEvent(eventId);
      showNotification(result.message, result.success ? 'error' : 'error');
    }
  };

  // Xử lý xóa sự kiện
  const handleDelete = (eventId) => {
    if (window.confirm("Bạn có chắc muốn xóa sự kiện này không?")) {
      const result = deleteEvent(eventId);
      showNotification(result.message, result.success ? 'success' : 'error');
    }
  };

  // Show loading while checking auth
  if (!user) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '280px', padding: '32px' }}>
          <div style={{ textAlign: 'center', paddingTop: '50px' }}>Đang tải...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="EventApproval-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header">
            <h2>Phê Duyệt Sự Kiện</h2>
          </div>

          <div className="tabs-row">
            <div className="events-tabs">
              <button
                className={`event-tab ${
                  activeTab === "pending" ? "active" : ""
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Chưa phê duyệt
              </button>
              <button
                className={`event-tab ${
                  activeTab === "approved" ? "active" : ""
                }`}
                onClick={() => setActiveTab("approved")}
              >
                Đã phê duyệt
              </button>
              <button
                className={`event-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
              </button>
            </div>
          </div>

          <div id="events-area">
            {filteredEvents.length === 0 ? (
              <div className="loading">Không có sự kiện nào.</div>
            ) : (
              <div className="event-list">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="event-card event-admin">
                    <div className="event-title-row">
                      <a href="#" className="event-title" onClick={handlePosts}>{event.title}</a>
                      <span className="event-date">{event.date}</span>
                    </div>
                    <div className="event-location">{event.location || 'Chưa có địa điểm'}</div>
                    <div className="event-desc">{event.description}</div>
                    
                    {/* Hiển thị thông tin người tạo */}
                    <div className="event-meta" style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
                      <span>Tạo bởi: {event.createdBy || 'Unknown'}</span>
                      {event.approvedBy && (
                        <span style={{ marginLeft: 12 }}>
                          • Duyệt bởi: {event.approvedBy}
                        </span>
                      )}
                    </div>

                    <div className="event-tags">
                      <span className={`event-status ${event.approvalStatus}`}>
                        {event.approvalStatus === "pending"
                          ? "Chờ phê duyệt"
                          : "Đã phê duyệt"}
                      </span>
                      <span className="event-attendees" style={{ marginLeft: 8 }}>
                        👥 {event.attendees || 0} người tham gia
                      </span>
                    </div>

                    <div className="event-actions" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      {event.approvalStatus === "pending" ? (
                        <>
                          <button
                            className="event-approve-btn"
                            onClick={() => handleApprove(event.id)}
                          >
                            ✅ Phê duyệt
                          </button>
                          <button
                            className="event-reject-btn"
                            onClick={() => handleReject(event.id)}
                            style={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: 14
                            }}
                          >
                            ❌ Từ chối
                          </button>
                          <button
                            className="event-edit-btn"
                            onClick={() => navigate('/admin/events')}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: 14
                            }}
                          >
                            ✏️ Chỉnh sửa
                          </button>
                          <button
                            className="event-delete-btn"
                            onClick={() => handleDelete(event.id)}
                          >
                            🗑️ Xóa
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="event-edit-btn"
                            onClick={() => navigate('/admin/events')}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: 14
                            }}
                          >
                            ✏️ Chỉnh sửa
                          </button>
                          <button
                            className="event-delete-btn"
                            onClick={() => handleDelete(event.id)}
                          >
                            🗑️ Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EventApproval;
