import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/unified-dashboard.css';
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

  const getRoleDisplay = (role) => {
    const roleMap = {
      USER: "Người dùng",
      EVENT_MANAGER: "Quản lý",
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUserAuth();
      
      if (response.success && response.data) {
        const mapped = response.data.map(userAuth => ({
          id: userAuth.userId,
          username: userAuth.userId.substring(0, 8),
          email: userAuth.email,
          role: userAuth.role,
          status: userAuth.status,
          joined: "N/A"
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

  const filteredUsers = useMemo(() => {
    let filtered = allUsers;
    if (roleFilter === "EVENT_MANAGER") {
      filtered = filtered.filter(u => u.role === "EVENT_MANAGER");
    } else if (roleFilter === "USER") {
      filtered = filtered.filter(u => u.role === "USER");
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.username.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [allUsers, roleFilter, searchTerm]);

  if (loading) {
    return React.createElement("div", { style: { display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" } },
      React.createElement(Sidebar),
      React.createElement("main", { style: { flex: 1, marginLeft: "280px", padding: "32px" } },
        React.createElement("div", { style: { textAlign: "center", paddingTop: "50px" } }, " Đang tải...")
      )
    );
  }

  if (error) {
    return React.createElement("div", { style: { display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" } },
      React.createElement(Sidebar),
      React.createElement("main", { style: { flex: 1, marginLeft: "280px", padding: "32px" } },
        React.createElement("div", { style: { textAlign: "center", paddingTop: "50px" } },
          React.createElement("div", { style: { color: "red", fontSize: "18px", marginBottom: "20px" } }, " " + error),
          React.createElement("button", {
            onClick: fetchUsers,
            style: { padding: "10px 20px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }
          }, " Thử lại")
        )
      )
    );
  }

  return React.createElement("div", { className: "UserManagement-container" },
    React.createElement(Sidebar),
    React.createElement("div", { className: "user-table-container" },
      React.createElement("h2", null, " Quản lý Người Dùng"),
      React.createElement("div", null, "Total users: " + filteredUsers.length)
    )
  );
};

export default UserManagement;
