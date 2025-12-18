import React, { useState } from "react";
import '../../assets/styles/unified-dashboard.css';
import Sidebar from "../../components/common/Sidebar";
import { showNotification as showToast } from '../../services/toastService';
import { approveRegistration, rejectRegistration } from '../../services/eventService';

const VolunteerApprove = () => {
  const [registrationId, setRegistrationId] = useState('');
  const [status, setStatus] = useState('approve');

  const handleSubmit = async () => {
    if (!registrationId) {
      showToast('Nhập registrationId', 'error');
      return;
    }
    const res = status === 'approve'
      ? await approveRegistration(registrationId)
      : await rejectRegistration(registrationId);
    if (res.success) {
      showToast('Đã gửi yêu cầu', 'success');
    } else {
      showToast(res.error || 'Không thể xử lý', 'error');
    }
  };

  return (
    <div className="UserManagement-container">
      <Sidebar />

      <div className="user-table-container">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: "10px" }}>Phê duyệt tình nguyện viên</h2>
          <p style={{ color: '#6b7280' }}>Backend chưa có API list registrations; nhập registrationId để duyệt/từ chối.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="registrationId"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            className="form-input"
            style={{ maxWidth: '240px' }}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select" style={{ maxWidth: '160px' }}>
            <option value="approve">Duyệt</option>
            <option value="reject">Từ chối</option>
          </select>
          <button className="btn-primary" onClick={handleSubmit}>Gửi</button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerApprove;
