import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Trash2, Lock, Unlock, Search, Filter, UserCheck, Clock, Ban } from 'lucide-react';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { getAllUserAuth, approveUser, banUser, unbanUser, deleteUser } from "../../services/userAuthService";

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const getRoleDisplay = (role) => {
    const roleMap = {
      USER: "Volunteer",
      EVENT_MANAGER: "Manager",
      ADMIN: "Admin"
    };
    return roleMap[role] || role;
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      PENDING: "Chờ duyệt",
      ACTIVE: "Hoạt động",
      LOCKED: "Đã khóa",
      DISABLED: "Vô hiệu hóa"
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      PENDING: { bg: '#FEF3C7', text: '#92400E', border: '#FDE047' },
      ACTIVE: { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },
      LOCKED: { bg: '#FEE2E2', text: '#991B1B', border: '#F87171' },
      DISABLED: { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' }
    };
    return colorMap[status] || colorMap.DISABLED;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUserAuth();
      
      if (response.success && response.data) {
        const mapped = response.data.map(userAuth => ({
          id: userAuth.userId,
          username: userAuth.email.split('@')[0],
          email: userAuth.email,
          role: userAuth.role,
          status: userAuth.status,
          emailVerified: userAuth.emailVerified,
          createdAt: userAuth.createdAt || 'N/A'
        }));
        setAllUsers(mapped);
      } else {
        setAllUsers([]);
        setError(response.error || "Không thể tải danh sách người dùng");
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
    fetchUsers();
  }, [user]);

  const filteredUsers = () => {
    let filtered = allUsers;
    
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.username.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Xác nhận duyệt tài khoản này?")) return;
    
    try {
      const result = await approveUser(userId);
      if (result.success) {
        fetchUsers();
      } else {
        showNotification(result.error || "Không thể duyệt tài khoản", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi duyệt tài khoản: " + error.message, "error");
    }
  };

  const handleBan = async (userId) => {
    if (!window.confirm("Xác nhận khóa tài khoản này?")) return;
    
    try {
      const result = await banUser(userId);
      if (result.success) {
        fetchUsers();
      } else {
        showNotification(result.error || "Không thể khóa tài khoản", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi khóa tài khoản: " + error.message, "error");
    }
  };

  const handleUnban = async (userId) => {
    if (!window.confirm("Xác nhận mở khóa tài khoản này?")) return;
    
    try {
      const result = await unbanUser(userId);
      if (result.success) {
        fetchUsers();
      } else {
        showNotification(result.error || "Không thể mở khóa tài khoản", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi mở khóa tài khoản: " + error.message, "error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("⚠️ Cảnh báo: Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu liên quan. Bạn có chắc chắn?")) return;
    
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        fetchUsers();
      } else {
        showNotification(result.error || "Không thể xóa tài khoản", "error");
      }
    } catch (error) {
      showNotification("Lỗi khi xóa tài khoản: " + error.message, "error");
    }
  };

  const users = filteredUsers();
  const pendingCount = allUsers.filter(u => u.status === 'PENDING').length;
  const activeCount = allUsers.filter(u => u.status === 'ACTIVE').length;
  const lockedCount = allUsers.filter(u => u.status === 'LOCKED').length;

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F7FA" }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: "280px", padding: "32px" }}>
          <div style={{ textAlign: "center", paddingTop: "50px" }}>
            <div style={{ fontSize: "18px", color: "#718EBF" }}>Đang tải dữ liệu...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F7FA" }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: "280px", padding: "32px" }}>
          <div style={{ textAlign: "center", paddingTop: "50px" }}>
            <div style={{ color: "#FE5C73", fontSize: "18px", marginBottom: "20px" }}>{error}</div>
            <button
              onClick={fetchUsers}
              style={{ 
                padding: "12px 24px", 
                backgroundColor: "#2D60FF", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              Thử lại
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F7FA" }}>
      <Sidebar />
      
      <main style={{ flex: 1, marginLeft: "280px", padding: "32px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#343C6A", marginBottom: "8px" }}>
            Quản lý Người Dùng
          </h1>
          <p style={{ color: "#718EBF", fontSize: "14px" }}>
            Duyệt, quản lý và theo dõi tất cả người dùng trong hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "14px", color: "#718EBF", marginBottom: "8px" }}>Tổng người dùng</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#343C6A" }}>{allUsers.length}</div>
          </div>
          
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Clock size={16} color="#F59E0B" />
              <div style={{ fontSize: "14px", color: "#718EBF" }}>Chờ duyệt</div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#F59E0B" }}>{pendingCount}</div>
          </div>
          
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <UserCheck size={16} color="#10B981" />
              <div style={{ fontSize: "14px", color: "#718EBF" }}>Hoạt động</div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#10B981" }}>{activeCount}</div>
          </div>
          
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Ban size={16} color="#EF4444" />
              <div style={{ fontSize: "14px", color: "#718EBF" }}>Đã khóa</div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#EF4444" }}>{lockedCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ position: "relative" }}>
                <Search size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#718EBF" }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo email hoặc username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 48px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="USER">Volunteer</option>
                <option value="EVENT_MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Đã khóa</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("ALL");
                setStatusFilter("ALL");
              }}
              style={{
                padding: "12px 20px",
                backgroundColor: "#F3F4F6",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#6B7280",
                cursor: "pointer"
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* User Table */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>EMAIL</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>USERNAME</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>VAI TRÒ</th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>TRẠNG THÁI</th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "48px", textAlign: "center", color: "#9CA3AF" }}>
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  users.map(u => {
                    const statusColor = getStatusColor(u.status);
                    return (
                      <tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "16px" }}>
                          <div style={{ fontSize: "14px", color: "#343C6A", fontWeight: "500" }}>{u.email}</div>
                          <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>ID: {u.id.substring(0, 8)}...</div>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#718EBF" }}>{u.username}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: u.role === 'ADMIN' ? '#FEE2E2' : u.role === 'EVENT_MANAGER' ? '#DBEAFE' : '#D1FAE5',
                            color: u.role === 'ADMIN' ? '#991B1B' : u.role === 'EVENT_MANAGER' ? '#1E40AF' : '#065F46'
                          }}>
                            {getRoleDisplay(u.role)}
                          </span>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            border: `1px solid ${statusColor.border}`
                          }}>
                            {getStatusDisplay(u.status)}
                          </span>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            {u.status === 'PENDING' && (
                              <button
                                onClick={() => handleApprove(u.id)}
                                title="Duyệt tài khoản"
                                style={{
                                  padding: "8px",
                                  backgroundColor: "#10B981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >
                                <Check size={16} />
                              </button>
                            )}
                            
                            {u.status === 'ACTIVE' && u.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleBan(u.id)}
                                title="Khóa tài khoản"
                                style={{
                                  padding: "8px",
                                  backgroundColor: "#EF4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >
                                <Lock size={16} />
                              </button>
                            )}
                            
                            {u.status === 'LOCKED' && (
                              <button
                                onClick={() => handleUnban(u.id)}
                                title="Mở khóa tài khoản"
                                style={{
                                  padding: "8px",
                                  backgroundColor: "#10B981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >
                                <Unlock size={16} />
                              </button>
                            )}
                            
                            {u.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleDelete(u.id)}
                                title="Xóa tài khoản"
                                style={{
                                  padding: "8px",
                                  backgroundColor: "#F3F4F6",
                                  color: "#6B7280",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div style={{ 
          marginTop: "24px", 
          padding: "16px 20px", 
          backgroundColor: "#EFF6FF", 
          borderRadius: "12px",
          border: "1px solid #DBEAFE"
        }}>
          <div style={{ fontSize: "13px", color: "#1E40AF", lineHeight: "1.6" }}>
            <strong>💡 Lưu ý:</strong>
            <ul style={{ marginTop: "8px", marginLeft: "20px" }}>
              <li>Tài khoản <strong>Manager</strong> cần được duyệt trước khi có thể đăng nhập</li>
              <li>Mật khẩu mặc định cho tất cả tài khoản mới: <code style={{ backgroundColor: "white", padding: "2px 6px", borderRadius: "4px" }}>123456789abc</code></li>
              <li>Không thể xóa hoặc khóa tài khoản <strong>Admin</strong></li>
              <li>Tài khoản bị khóa có thể được mở khóa bất cứ lúc nào</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
