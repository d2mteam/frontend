import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../../assets/styles/unified-dashboard.css';
import Sidebar from "../../components/common/Sidebar";
import { listMemberInEvent } from "../../services/eventService";
import { showNotification as showToast } from "../../services/toastService";

const VolunteerList = () => {
  const { eventId } = useParams();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchMembers(eventId);
    } else {
      setVolunteers([]);
    }
  }, [eventId]);

  const fetchMembers = async (id) => {
    try {
      setLoading(true);
      const res = await listMemberInEvent(id, 0, 50);
      if (res.success) {
        const mapped = (res.data.content || []).map((m) => ({
          id: m.id,
          name: m.userProfile?.fullName || m.userProfile?.username || 'Ẩn danh',
          email: m.userProfile?.email || 'N/A',
          status: m.participationStatus || 'UNKNOWN',
          role: m.eventRole || 'EVENT_MEMBER',
        }));
        setVolunteers(mapped);
      } else {
        showToast(res.error || 'Không thể tải danh sách', 'error');
      }
    } catch (error) {
      console.error('Load members error', error);
      showToast('Không thể tải danh sách tình nguyện viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="UserManagement-container">
      <Sidebar />

      <div className="user-table-container">
        <h2 style={{ marginBottom: "10px" }}>
          Danh sách tình nguyện viên sự kiện {eventId || ''}
        </h2>

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={4}>Đang tải...</td></tr>
            ) : volunteers.length === 0 ? (
              <tr><td colSpan={4}>Chưa có dữ liệu (cần eventId)</td></tr>
            ) : (
              volunteers.map((vol) => (
                <tr key={vol.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {vol.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="user-name">{vol.name}</div>
                    </div>
                  </td>

                  <td>
                    <div className="contact-info">
                      <div>{vol.email}</div>
                    </div>
                  </td>

                  <td>
                    <span className="status-badge approved">
                      {vol.status}
                    </span>
                  </td>

                  <td>
                    <div className="actions">{vol.role}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerList;
