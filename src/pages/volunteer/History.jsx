import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import { getParticipationHistory } from "../../services/eventService";
import { showNotification } from "../../services/toastService";
import "../../assets/styles/events.css";

const PAGE_SIZE = 10;

const statusStyle = {
  APPROVED: { bg: "#ecfdf3", color: "#15803d", label: "Đang tham gia" },
  PENDING: { bg: "#fef3c7", color: "#b45309", label: "Chờ duyệt" },
  REJECTED: { bg: "#fee2e2", color: "#b91c1c", label: "Bị từ chối" },
  COMPLETED: { bg: "#e0f2fe", color: "#1d4ed8", label: "Hoàn thành" },
  LEFT_EVENT: { bg: "#f1f5f9", color: "#475569", label: "Đã rời sự kiện" },
};

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    fetchHistory(0);
  }, []);

  const fetchHistory = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getParticipationHistory(page, PAGE_SIZE);
      if (response.success) {
        const content = response.data?.content || [];
        const mapped = content.map((item, idx) => ({
          key: `${item.event?.eventId || "event"}-${idx}`,
          eventId: item.event?.eventId,
          title: item.event?.eventName || "Sự kiện",
          location: item.event?.eventLocation || "N/A",
          desc: item.event?.eventDescription || "",
          status: item.participationStatus || "APPROVED",
          role: item.eventRole || "Thành viên",
        }));
        setHistory(mapped);
        if (response.data?.pageInfo) {
          setPageInfo(response.data.pageInfo);
        }
      } else {
        setHistory([]);
        setPageInfo((prev) => ({ ...prev, totalElements: 0, totalPages: 1, page: 0 }));
        showNotification("Không thể tải lịch sử tham gia", "error");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      showNotification("Không thể tải lịch sử tham gia", "error");
      setHistory([]);
      setPageInfo((prev) => ({ ...prev, totalElements: 0, totalPages: 1, page: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handlePosts = (eventId) => {
    if (eventId) navigate(`/eventPosts/${eventId}`);
  };

  const stats = useMemo(
    () => ({
      totalEvents: pageInfo.totalElements || history.length,
    }),
    [pageInfo, history.length]
  );

  const pageNumbers = useMemo(() => {
    const total = pageInfo.totalPages || 1;
    return Array.from({ length: total }, (_, i) => i);
  }, [pageInfo.totalPages]);

  const currentStatusStyle = (status) => statusStyle[status] || statusStyle.APPROVED;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div style={{marginRight: "50px" }}>
            <div className="events-header">
              <div>
                <h2>Lịch sử tham gia</h2>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "14px", opacity: 0.9 }}>Tổng sự kiện</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", marginTop: "8px" }}>{stats.totalEvents}</div>
              </div>
            </div>

            {loading ? (
              <div className="loading">Đang tải lịch sử...</div>
            ) : history.length === 0 ? (
              <div className="loading">Bạn chưa có lịch sử tham gia.</div>
            ) : (
              <>
                <div className="event-list">
                  {history.map((event) => {
                    const badge = currentStatusStyle(event.status);
                    return (
                      <div key={event.key} className="event-card event-vol">
                        <div className="event-title-row">
                          <button
                            className="event-title"
                            onClick={() => handlePosts(event.eventId)}
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                          >
                            {event.title}
                          </button>
                          <span className="event-date">ID: {event.eventId || "N/A"}</span>
                        </div>

                        <div className="event-location">📍 {event.location}</div>
                        <div className="event-desc">{event.desc}</div>

                        <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "13px" }}>
                          <span
                            style={{
                              background: badge.bg,
                              color: badge.color,
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontWeight: 600,
                            }}
                          >
                            {badge.label}
                          </span>
                          {event.role && <span style={{ color: "#374151", fontWeight: 600 }}>🎯 Vai trò: {event.role}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchHistory(p)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: p === pageInfo.page ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                        background: p === pageInfo.page ? "#ede9fe" : "#fff",
                        color: p === pageInfo.page ? "#312e81" : "#111827",
                        cursor: "pointer",
                        minWidth: 38,
                        fontWeight: 600,
                      }}
                    >
                      {p + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
