import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { getMyProfile } from '../services/userProfileService';
import { showNotification } from '../services/toastService';

export default function UserPublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile(userId);
        if (res.success) {
          setProfile(res.data);
        } else {
          showNotification(res.error || 'Không tìm thấy hồ sơ', 'error');
        }
      } catch (error) {
        showNotification(error.message || 'Không thể tải hồ sơ', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>Hồ sơ người dùng</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Xem thông tin công khai</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            ← Quay lại
          </button>
        </div>

        {loading ? (
          <div>Đang tải...</div>
        ) : !profile ? (
          <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
            Không tìm thấy hồ sơ.
          </div>
        ) : (
          <div style={{ background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#4f46e5', fontSize: 22
              }}>
                {(profile.fullName || profile.username || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.fullName || 'Chưa cập nhật tên'}</div>
                <div style={{ color: '#6b7280' }}>@{profile.username || 'N/A'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><strong>Email:</strong> {profile.email || 'N/A'}</div>
              <div><strong>Trạng thái:</strong> {profile.status || 'N/A'}</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <strong>Giới thiệu:</strong>
              <div style={{ marginTop: 8, color: '#374151' }}>{profile.bio || 'Chưa có giới thiệu'}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
