import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/unified-dashboard.css';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { findUserProfiles } from "../../services/userProfileService";
import { banUser, unbanUser } from "../../services/userAuthService";

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });

  const getStatusDisplay = (status) => {
    const statusMap = {
      PENDING: "Chờ duyệt",
      ACTIVE: "Hoạt động",
      LOCKED: "Đã khóa",
      BANNED: "Đã khóa",
      DISABLED: "Vô hiệu hóa"
    };
    return statusMap[status] || status;
  };

  const pageSize = 10;

  const fetchUsers = async (page = pageInfo.page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await findUserProfiles(page, pageSize);
      
      if (response.success && response.data) {
        const mapped = (response.data.content || []).map(userProfile => ({
          id: userProfile.userId,
          username: userProfile.username || userProfile.fullName || userProfile.userId?.substring(0, 8) || 'N/A',
          fullName: userProfile.fullName || '',
          email: userProfile.email || '',
          status: userProfile.status || '',
          joined: userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('vi-VN') : ''
        }));
        setAllUsers(mapped);
        const info = response.data.pageInfo || {};
        setPageInfo({
          page: info.page ?? page,
          size: info.size ?? pageSize,
          totalElements: info.totalElements ?? mapped.length,
          totalPages: info.totalPages ?? 1,
          hasNext: info.hasNext ?? false,
          hasPrevious: info.hasPrevious ?? false
        });
      } else {
        setAllUsers([]);
        setError(response.error || "Không thể tải danh sách người dùng");
        setPageInfo((prev) => ({ ...prev, page }));
      }
    } catch (error) {
      setAllUsers([]);
      setError(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
      showNotification("Không thể tải danh sách người dùng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    fetchUsers(0);
  }, [user]);

  const filteredUsers = useMemo(() => {
    let filtered = allUsers;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        (u.username || '').toLowerCase().includes(term) || 
        (u.email || '').toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [allUsers, searchTerm]);

  const handleBan = async (userId) => {
    const res = await banUser(userId);
    if (res.success) {
      showNotification(res.message || 'Đã khóa người dùng', 'success');
      fetchUsers();
    } else {
      showNotification(res.error || 'Không thể khóa người dùng', 'error');
    }
  };

  const handleUnban = async (userId) => {
    const res = await unbanUser(userId);
    if (res.success) {
      showNotification(res.message || 'Đã mở khóa người dùng', 'success');
      fetchUsers();
    } else {
      showNotification(res.error || 'Không thể mở khóa người dùng', 'error');
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    fetchUsers(nextPage);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h2 style={{ marginBottom: 12 }}>Quản lý Người Dùng</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo username hoặc email"
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              minWidth: 260
            }}
          />
        </div>
        {loading && <div>Đang tải...</div>}
        {error && (
          <div style={{ color: 'red', marginBottom: 12 }}>
            {error} <button onClick={fetchUsers}>Thử lại</button>
          </div>
        )}
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                style={{
                  padding: 14,
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button
                    onClick={() => navigate(`/users/${u.id}`)}
                    style={{
                      fontWeight: 700,
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#2563eb',
                      cursor: 'pointer'
                    }}
                  >
                    {u.fullName || u.username}
                  </button>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{u.email || 'Không có email'}</div>
                  <div style={{ color: '#4b5563', fontSize: 13 }}>
                    Trạng thái: <strong>{(getStatusDisplay(u.status || '') || '').toUpperCase()}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {u.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleBan(u.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 10,
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        background: '#fef2f2',
                        cursor: 'pointer'
                      }}
                    >
                      Ban
                    </button>
                  )}
                  {(u.status === 'LOCKED' || u.status === 'BANNED') && (
                    <button
                      onClick={() => handleUnban(u.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 10,
                        border: '1px solid #10b981',
                        color: '#065f46',
                        background: '#ecfdf3',
                        cursor: 'pointer'
                      }}
                    >
                      Unban
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div style={{ color: '#6b7280' }}>Không có người dùng nào.</div>
            )}
          </div>
        )}
        {!loading && !error && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => handlePageChange((pageInfo.page || 0) - 1)}
              disabled={!pageInfo.hasPrevious && (pageInfo.page <= 0)}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: (!pageInfo.hasPrevious && (pageInfo.page <= 0)) ? '#f3f4f6' : '#fff',
                color: '#111827',
                cursor: (!pageInfo.hasPrevious && (pageInfo.page <= 0)) ? 'not-allowed' : 'pointer'
              }}
            >
              Trang trước
            </button>
            <span style={{ color: '#4b5563' }}>
              Trang { (pageInfo.page ?? 0) + 1 } / { pageInfo.totalPages || 1 }
            </span>
            <button
              onClick={() => handlePageChange((pageInfo.page || 0) + 1)}
              disabled={!pageInfo.hasNext && ((pageInfo.page || 0) + 1 >= (pageInfo.totalPages || 1))}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: (!pageInfo.hasNext && ((pageInfo.page || 0) + 1 >= (pageInfo.totalPages || 1))) ? '#f3f4f6' : '#fff',
                color: '#111827',
                cursor: (!pageInfo.hasNext && ((pageInfo.page || 0) + 1 >= (pageInfo.totalPages || 1))) ? 'not-allowed' : 'pointer'
              }}
            >
              Trang sau
            </button>
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              {pageInfo.totalElements || filteredUsers.length} người dùng
            </span>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
