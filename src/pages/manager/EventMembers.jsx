import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import { listMemberInEvent, getEventRegistrationByEventId, approveRegistration, rejectRegistration, changeParticipationStatus } from "../../services/eventService";
import { showNotification } from "../../services/toastService";

const PAGE_SIZE = 10;

const statusStyle = {
  APPROVED: { bg: "#ecfdf3", color: "#15803d", label: "Đang tham gia" },
  COMPLETED: { bg: "#e0f2fe", color: "#075985", label: "Hoàn thành" },
  PENDING: { bg: "#fef3c7", color: "#b45309", label: "Chờ duyệt" },
  REJECTED: { bg: "#fee2e2", color: "#b91c1c", label: "Từ chối" },
};

const roleLabel = (role) => role || "Thành viên";

export default function EventMembers() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("approved");

  const [members, setMembers] = useState([]);
  const [memberPage, setMemberPage] = useState({ page: 0, size: PAGE_SIZE, totalPages: 1, totalElements: 0 });
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [registrations, setRegistrations] = useState([]);
  const [registrationPage, setRegistrationPage] = useState({ page: 0, size: PAGE_SIZE, totalPages: 1, totalElements: 0 });
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    fetchMembers(0);
    fetchRegistrations(0);
  }, [eventId]);

  const fetchMembers = async (page = 0) => {
    try {
      setLoadingMembers(true);
      const res = await listMemberInEvent(eventId, page, PAGE_SIZE);
      if (res.success) {
        setMembers(res.data?.content || []);
        setMemberPage(res.data?.pageInfo || memberPage);
      } else {
        setMembers([]);
        showNotification(res.error || "Không thể tải thành viên", "error");
      }
    } catch (error) {
      console.error("Fetch members error", error);
      showNotification("Không thể tải thành viên", "error");
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchRegistrations = async (page = 0) => {
    try {
      setLoadingRegistrations(true);
      const res = await getEventRegistrationByEventId(eventId, page, PAGE_SIZE);
      if (res.success) {
        setRegistrations(res.data?.content || []);
        setRegistrationPage(res.data?.pageInfo || registrationPage);
      } else {
        setRegistrations([]);
        showNotification(res.error || "Không thể tải đăng ký chờ duyệt", "error");
      }
    } catch (error) {
      console.error("Fetch registrations error", error);
      showNotification("Không thể tải đăng ký chờ duyệt", "error");
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const pageNumbers = (pageInfo) => {
    const total = pageInfo.totalPages || 1;
    return Array.from({ length: total }, (_, i) => i);
  };

  const renderBadge = (status) => {
    const style = statusStyle[status] || statusStyle.PENDING;
    return (
      <span style={{ background: style.bg, color: style.color, padding: "6px 10px", borderRadius: "999px", fontWeight: 700, fontSize: "0.9rem" }}>
        {style.label}
      </span>
    );
  };

  const ApprovedList = () => (
    <>
      {loadingMembers ? (
        <div className="loading">Đang tải thành viên...</div>
      ) : members.length === 0 ? (
        <div className="loading">Chưa có thành viên nào.</div>
      ) : (
        <div className="event-list">
          {members.map((m, idx) => {
            const name = m.userProfile?.fullName || m.userProfile?.username;
            const username = m.userProfile?.username;
            const userId = m.userProfile?.userId;
            const eventName = m.event?.eventName;
            const role = roleLabel(m.eventRole);
            return (
            <div key={`${userId || idx}`} className="event-card event-vol">
              <div className="event-title-row">
                <div className="event-title" style={{ cursor: "default" }}>
                  {name || "Người dùng"}
                </div>
                {renderBadge(m.participationStatus)}
              </div>
              {(username || userId) && (
                <div style={{ color: "#4b5563", marginBottom: 8 }}>
                  {username ? `@${username}` : ""}{username && userId ? " · " : ""}{userId || ""}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: "13px", color: "#374151" }}>
                {role && <span>Vai trò: {role}</span>}
                {eventName && <span>Sự kiện: {eventName}</span>}
              </div>
              {m.participationStatus === "APPROVED" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={async () => {
                      const res = await changeParticipationStatus(eventId, m.userProfile?.userId, "COMPLETED");
                      if (res.success) {
                        showNotification("Đã đánh dấu hoàn thành", "success");
                        fetchMembers(memberPage.page);
                      } else {
                        showNotification(res.error || "Không thể cập nhật trạng thái", "error");
                      }
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #0ea5e9",
                      background: "#e0f2fe",
                      color: "#075985",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Đánh dấu hoàn thành
                  </button>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {pageNumbers(memberPage).map((p) => (
          <button
            key={p}
            onClick={() => fetchMembers(p)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: p === memberPage.page ? "2px solid #4f46e5" : "1px solid #e5e7eb",
              background: p === memberPage.page ? "#ede9fe" : "#fff",
              color: p === memberPage.page ? "#312e81" : "#111827",
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
  );

  const PendingList = () => (
    <>
      {loadingRegistrations ? (
        <div className="loading">Đang tải đăng ký...</div>
      ) : registrations.length === 0 ? (
        <div className="loading">Không có đăng ký chờ duyệt.</div>
      ) : (
        <div className="event-list">
          {registrations.map((r, idx) => {
            const name = r.userProfile?.fullName || r.userProfile?.username || "Người dùng";
            const username = r.userProfile?.username || '';
            const email = r.userProfile?.email || '';
            const eventName = r.event?.eventName || '';
            const contact = [username ? `@${username}` : '', email].filter(Boolean).join(' · ');

            return (
              <div key={`${r.registrationId || idx}`} className="event-card event-vol">
                <div className="event-title-row">
                  <div className="event-title" style={{ cursor: "default" }}>
                    {name}
                  </div>
                  {renderBadge(r.status)}
                </div>
                {contact && (
                  <div style={{ color: "#4b5563", marginBottom: 8 }}>
                    {contact}
                  </div>
                )}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: "13px", color: "#374151" }}>
                  {eventName && <span>Sự kiện: {eventName}</span>}
                </div>
                {r.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button
                      onClick={async () => {
                        const res = await approveRegistration(r.registrationId);
                        if (res.success) {
                          showNotification("Đã duyệt đăng ký", "success");
                          fetchRegistrations(registrationPage.page);
                        } else {
                          showNotification(res.error || "Không thể duyệt", "error");
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid #10b981',
                        background: '#ecfdf3',
                        color: '#065f46',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={async () => {
                        const res = await rejectRegistration(r.registrationId);
                        if (res.success) {
                          showNotification("Đã từ chối đăng ký", "success");
                          fetchRegistrations(registrationPage.page);
                        } else {
                          showNotification(res.error || "Không thể từ chối", "error");
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid #f87171',
                        background: '#fef2f2',
                        color: '#b91c1c',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {pageNumbers(registrationPage).map((p) => (
          <button
            key={p}
            onClick={() => fetchRegistrations(p)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: p === registrationPage.page ? "2px solid #4f46e5" : "1px solid #e5e7eb",
              background: p === registrationPage.page ? "#ede9fe" : "#fff",
              color: p === registrationPage.page ? "#312e81" : "#111827",
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
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="main-header">
          <div>
            <h1 className="dashboard-title">Quản lý thành viên sự kiện</h1>
            <p className="dashboard-subtitle">Sự kiện ID: {eventId}</p>
          </div>
          <button className="btn-home-dropdown" onClick={() => navigate(-1)}>Quay lại</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { key: "approved", label: "Đã tham gia" },
            { key: "pending", label: "Chờ duyệt" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: activeTab === tab.key ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                background: activeTab === tab.key ? "#eef2ff" : "#fff",
                color: "#111827",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "approved" ? <ApprovedList /> : <PendingList />}
      </main>
    </div>
  );
}
