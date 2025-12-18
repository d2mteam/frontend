import React, { useState } from "react";
import '../../assets/styles/unified-dashboard.css';
import Sidebar from "../../components/common/Sidebar";

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "vana@example.com", phone: "0123456789", status: "Đã duyệt", completed: false },
    { id: 2, name: "Trần Thị B", email: "thib@example.com", phone: "0987654321", status: "Đã duyệt", completed: false },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com", phone: "0911222333", status: "Đã duyệt", completed: false },
  ]);

  const handleCheckboxChange = (id) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, completed: !v.completed } : v))
    );
  };

  const handleSave = () => {
    const completedVolunteers = volunteers.filter((v) => v.completed);
    if (completedVolunteers.length === 0) {
      alert("Chưa chọn tình nguyện viên nào hoàn thành!");
      return;
    }

    alert(
      `Đã lưu trạng thái hoàn thành cho: \n${completedVolunteers
        .map((v) => v.name)
        .join(", ")}`
    );
  };

  return (
    <div className="UserManagement-container">
      <Sidebar />

      <div className="user-table-container">
        <h2 style={{ marginBottom: "10px" }}>
          Danh sách tình nguyện viên sự kiện đang diễn ra
        </h2>

        <table className="user-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Liên hệ</th>
              <th>Trạng thái</th>
              <th>Hoàn thành</th>
            </tr>
          </thead>

          <tbody>
            {volunteers.map((vol) => (
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
                    <div className="phone">{vol.phone}</div>
                  </div>
                </td>

                <td>
                  <span className="status-badge approved">{vol.status}</span>
                </td>

                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={vol.completed}
                    onChange={() => handleCheckboxChange(vol.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button
            className="save-btn"
            onClick={handleSave}
            style={{
              background: "#28a745",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerList;
