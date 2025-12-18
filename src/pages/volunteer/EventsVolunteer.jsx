import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import { getAllEvents, registerForEvent } from "../../services/eventService";
import { showNotification } from "../../services/toastService";
import '../../assets/styles/home.css';

export default function EventsVolunteer() {
  const navigate = useNavigate();
  const handlePosts = (eventId) => {
    navigate(`/eventPosts/${eventId}`);
  };
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  
  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents(0, 50);
      if (response.success) {
        // Map GraphQL data to frontend format
        const mappedEvents = response.data.map(event => ({
          id: event.eventId,
          title: event.eventName || 'Sự kiện',
          date: event.createdAt ? new Date(event.createdAt).toLocaleDateString('vi-VN') : 'Chưa rõ',
          location: event.eventLocation || 'Chưa xác định',
          desc: event.eventDescription || '',
          status: 'upcoming',
          attendees: 0,
          image: null,
          capacity: null,
          creator: event.createBy?.username || event.createBy?.fullName || 'Unknown'
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showNotification('Không thể tải danh sách sự kiện', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredEvents = events.filter((e) => e.status === activeTab);
  
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = (event) => {
    setRegisteringEvent(event);
    setShowRegister(true);
  };

  const closeRegister = () => {
    setShowRegister(false);
    setRegisteringEvent(null);
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    if (!registeringEvent || submitting) return;
    
    try {
      setSubmitting(true);
      const response = await registerForEvent(registeringEvent.id);
      
      if (response.success) {
        showNotification('Đăng ký thành công! Chờ quản lý phê duyệt.', 'success');
        setRegisteredEventIds(prev => [...prev, registeringEvent.id]);
        closeRegister();
        // Refresh events to get updated attendee count
        fetchEvents();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      showNotification(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRegistration = async (eventId) => {
    // TODO: Implement cancel registration API if needed
    alert("Chức năng hủy đăng ký sẽ được bổ sung sau.");
  };  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        {/* Header Section */}
        <div className="main-header">
          <div>
            <h1 className="dashboard-title">Sự Kiện Tình Nguyện</h1>
            <p className="dashboard-subtitle">Khám phá và tham gia các hoạt động thiện nguyện</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card" style={{"--accent-color": "#10b981"}}>
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3 className="stat-value">{filteredEvents.length}</h3>
                <p className="stat-label">Sự kiện {activeTab === 'upcoming' ? 'sắp tới' : activeTab === 'ongoing' ? 'đang diễn' : 'hoàn thành'}</p>
              </div>
            </div>
            <div className="stat-card" style={{"--accent-color": "#3b82f6"}}>
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3 className="stat-value">{events.filter(e => e.status === 'upcoming').length}</h3>
                <p className="stat-label">Sắp diễn ra</p>
              </div>
            </div>
            <div className="stat-card" style={{"--accent-color": "#f59e0b"}}>
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3 className="stat-value">{events.filter(e => e.status === 'ongoing').length}</h3>
                <p className="stat-label">Đang diễn ra</p>
              </div>
            </div>
            <div className="stat-card" style={{"--accent-color": "#8b5cf6"}}>
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3 className="stat-value">{registeredEventIds.length}</h3>
                <p className="stat-label">Đã tham gia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '2rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab("upcoming")}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'upcoming' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: activeTab === 'upcoming' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'upcoming' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
            }}
          >
            🚀 Sắp diễn ra
          </button>
          <button
            onClick={() => setActiveTab("ongoing")}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'ongoing' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: activeTab === 'ongoing' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'ongoing' ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none'
            }}
          >
            🔥 Đang diễn ra
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === 'completed' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
              color: activeTab === 'completed' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'completed' ? '0 4px 12px rgba(139, 92, 246, 0.25)' : 'none'
            }}
          >
            ✅ Đã hoàn thành
          </button>
        </div>

        {/* Events Grid */}
        <div className="events-section">
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 0',
              color: '#64748b',
              fontSize: '1.1rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
              Đang tải danh sách sự kiện...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 0',
              color: '#64748b',
              fontSize: '1.1rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              Không có sự kiện nào
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <div key={event.id} className="event-card-modern">
                  {/* Event Image */}
                  {event.image && (
                    <div style={{ 
                      marginBottom: '1.5rem', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      height: '200px'
                    }}>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className={`event-badge ${event.status === 'ongoing' ? 'featured' : ''}`}>
                    {event.status === "upcoming" ? "🚀 Sắp tới"
                      : event.status === "ongoing" ? "🔥 Đang diễn"
                      : "✅ Hoàn thành"}
                  </div>

                  {/* Event Title */}
                  <h3 className="event-title">{event.title}</h3>

                  {/* Event Description */}
                  <p className="event-description">
                    {event.desc || 'Tham gia cùng chúng tôi trong hoạt động ý nghĩa này!'}
                  </p>

                  {/* Event Meta */}
                  <div className="event-meta">
                    <div className="meta-item">
                      📅 {event.date}
                    </div>
                    <div className="meta-item">
                      📍 {event.location}
                    </div>
                    <div className="meta-item">
                      👥 {event.attendees}/{event.capacity || '∞'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                    {event.status === "upcoming" && (
                      !registeredEventIds.includes(event.id) ? (
                        <button 
                          className="event-join-btn" 
                          onClick={() => handleRegister(event)}
                          style={{ flex: 1 }}
                        >
                          🎯 Tham gia ngay
                        </button>
                      ) : (
                        <button 
                          onClick={() => cancelRegistration(event.id)}
                          style={{
                            flex: 1,
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.875rem 1.5rem',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#fecaca';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          ❌ Hủy tham gia
                        </button>
                      )
                    )}
                    <button 
                      onClick={(e) => { e.preventDefault(); handlePosts(event.id); }}
                      style={{
                        flex: event.status === "upcoming" ? '0 0 auto' : 1,
                        background: 'white',
                        color: '#10b981',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        padding: '0.875rem 1.5rem',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f0fdf4';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      📝 Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Registration Modal */}
      {showRegister && registeringEvent && (
        <div 
          onClick={(e) => {
            if (e.target.className === "register-overlay") closeRegister();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 20,
            animation: "fadeIn 0.2s ease"
          }}
          className="register-overlay"
        >
          <div 
            role="dialog"
            aria-modal="true"
            style={{
              width: "100%",
              maxWidth: 600,
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "slideUp 0.3s ease"
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '0.5rem'
                }}>
                  {registeringEvent.title}
                </h3>
                <div style={{ 
                  fontSize: '0.95rem', 
                  color: '#64748b',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <span>📅 {registeringEvent.date}</span>
                  <span>📍 {registeringEvent.location}</span>
                </div>
              </div>
              <button 
                onClick={closeRegister} 
                aria-label="Close"
                style={{
                  border: "none",
                  background: "#f1f5f9",
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  fontSize: '1.25rem',
                  cursor: "pointer",
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={submitRegistration}
              style={{ display: "flex", flexDirection: "column", gap: '1.5rem' }}
            >
              {/* Info Box */}
              <div style={{ 
                padding: '1.25rem', 
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
                borderRadius: '12px', 
                fontSize: '0.95rem', 
                color: '#065f46',
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Xác nhận đăng ký</strong>
                    Bạn đang đăng ký tham gia sự kiện này. Quản lý sẽ xem xét và phê duyệt đăng ký của bạn.
                  </div>
                </div>
              </div>

              {/* Event Stats */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>
                    Sức chứa
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>
                    {registeringEvent.capacity || '∞'}
                  </div>
                </div>
                <div style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>
                    Đã đăng ký
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                    {registeringEvent.attendees}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                gap: '12px',
                justifyContent: "flex-end",
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button 
                  type="button" 
                  onClick={closeRegister}
                  disabled={submitting}
                  style={{
                    padding: "0.875rem 1.5rem",
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: submitting ? 0.5 : 1
                  }}
                  onMouseOver={(e) => !submitting && (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={(e) => !submitting && (e.currentTarget.style.background = 'white')}
                >
                  Hủy
                </button>

                <button 
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "0.875rem 2rem",
                    borderRadius: '12px',
                    border: 'none',
                    background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: submitting ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseOver={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {submitting ? '⏳ Đang gửi...' : '✅ Xác nhận đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
