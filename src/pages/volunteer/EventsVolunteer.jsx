import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { searchEvents, registerForEvent, unregisterFromEvent } from "../../services/eventService";
import { showNotification } from "../../services/toastService";
import "../../assets/styles/home.css";

export default function EventsVolunteer() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [categoriesInput, setCategoriesInput] = useState("");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Giảm tốc độ gửi request ~0.5s theo yêu cầu
      await new Promise((resolve) => setTimeout(resolve, 500));
      const startFrom = startDateFrom ? `${startDateFrom}T00:00:00` : null;
      const startTo = startDateTo ? `${startDateTo}T23:59:59` : null;
      const filter = {
        keyword: keyword.trim() ? keyword.trim() : null,
        categories: (categoriesInput || "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        startDateFrom: startFrom,
        startDateTo: startTo,
        location: location.trim() ? location.trim() : null
      };
      const res = await searchEvents(filter);
      if (res.success) {
        const mapped = res.data.map((e) => ({
          id: e.eventId,
          title: e.eventName || "Sự kiện",
          location: e.eventLocation || "Chưa xác định",
          desc: e.eventDescription || "",
          date: e.createdAt ? new Date(e.createdAt).toLocaleDateString("vi-VN") : "",
          categories: e.categories || [],
          status: e.eventState || "PENDING", // backend trả eventState
          isJoined: !!e.isJoined
        }));
        setEvents(mapped);
      }
    } catch (error) {
      showNotification("Không thể tải danh sách sự kiện", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => events, [events]);

  const handleJoin = async (eventId) => {
    const res = await registerForEvent(eventId);
    if (res.success) {
      showNotification("Đăng ký thành công", "success");
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, isJoined: true } : e))
      );
    } else {
      showNotification(res.error || "Không thể đăng ký", "error");
    }
  };

  const handleCancel = async (eventId) => {
    const res = await unregisterFromEvent(eventId);
    if (res.success) {
      showNotification("Đã hủy đăng ký", "success");
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, isJoined: false } : e))
      );
    } else {
      showNotification(res.error || "Không thể hủy đăng ký", "error");
    }
  };

  const handleDetail = (eventId) => navigate(`/eventPosts/${eventId}`);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content" style={{ background: "#f6f7fb", minHeight: "100vh" }}>
        <div className="main-header">
          <div>
            <h1 className="dashboard-title">Sự kiện</h1>
            <p className="dashboard-subtitle">Danh sách sự kiện</p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(3, minmax(140px, 1fr)) minmax(140px, 1fr) auto",
            gap: "10px",
            marginBottom: "12px",
            alignItems: "end"
          }}
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo từ khóa"
            className="form-input"
            style={{ width: "100%" }}
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Địa điểm"
            className="form-input"
            style={{ width: "100%", minWidth: 140 }}
          />
          <input
            type="text"
            value={categoriesInput}
            onChange={(e) => setCategoriesInput(e.target.value)}
            placeholder="Danh mục (phân tách bằng dấu phẩy)"
            className="form-input"
            style={{ width: "100%", minWidth: 140 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Từ ngày</span>
            <input
              type="date"
              value={startDateFrom}
              onChange={(e) => setStartDateFrom(e.target.value)}
              className="form-input"
              style={{ width: "100%", minWidth: 140 }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Đến ngày</span>
            <input
              type="date"
              value={startDateTo}
              onChange={(e) => setStartDateTo(e.target.value)}
              className="form-input"
              style={{ width: "100%", minWidth: 140 }}
            />
          </div>
          <button
            type="button"
            onClick={fetchEvents}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <Search size={18} />
            Tìm kiếm
          </button>
        </div>

        <div className="events-section" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b", fontSize: "1.1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
              Đang tải danh sách sự kiện...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b", fontSize: "1.1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              Không có sự kiện nào
            </div>
          ) : (
            <div className="events-grid admin-events-grid">
              {filteredEvents.map((event) => {
                const isRegistered = !!event.isJoined;
                return (
                  <div
                    key={event.id}
                    className="event-card-modern"
                    style={{
                      padding: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      minHeight: "260px"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h3 className="event-title" style={{ margin: 0 }}>{event.title}</h3>
                        <span style={{ color: "#111827", fontWeight: 600 }}>{event.date}</span>
                      </div>
                      <div style={{ color: "#6b7280" }}>{event.location}</div>
                      <div style={{ color: "#374151" }}>
                        {event.desc || "Tham gia cùng chúng tôi trong hoạt động ý nghĩa này!"}
                      </div>
                      {event.categories && event.categories.length > 0 && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {event.categories.map((c) => (
                            <span key={c} style={{ padding: "4px 10px", borderRadius: 999, background: "#eef2ff", color: "#4338ca", fontSize: "12px" }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "auto" }}>
                      {isRegistered ? (
                        <>
                          <button
                            onClick={() => handleCancel(event.id)}
                            style={{
                              background: "#dc2626",
                              color: "#fff",
                              border: "none",
                              borderRadius: 10,
                              padding: "10px 12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Hủy đăng ký
                          </button>
                          <button
                            onClick={() => handleDetail(event.id)}
                            style={{
                              background: "#fff",
                              color: "#5c4de1",
                              border: "2px solid #5c4de1",
                              borderRadius: 10,
                              padding: "10px 12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleJoin(event.id)}
                            style={{
                              background: "linear-gradient(135deg, #5c4de1, #4f46e5)",
                              color: "#fff",
                              border: "none",
                              borderRadius: 10,
                              padding: "10px 12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Đăng ký
                          </button>
                          <button
                            onClick={() => handleDetail(event.id)}
                            style={{
                              background: "#fff",
                              color: "#5c4de1",
                              border: "2px solid #5c4de1",
                              borderRadius: 10,
                              padding: "10px 12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
