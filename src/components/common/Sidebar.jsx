import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/styles/home.css';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const getRoleKey = (userRole) => {
    if (!userRole) return 'volunteer';
    const roleUpper = userRole.toUpperCase();
    if (roleUpper === 'ADMIN') return 'admin';
    if (roleUpper === 'EVENT_MANAGER') return 'manager';
    return 'volunteer';
  };
  
  const role = getRoleKey(user?.role);

  const menuGroups = {
    volunteer: [
      {
        title: 'TRANG CHÍNH',
        items: [
          { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
          { key: 'events', label: 'Sự kiện', icon: '📅', to: '/events' },
          { key: 'history', label: 'Lịch sử tham gia', icon: '🕒', to: '/history' },
        ]
      },
      {
        title: 'CÁ NHÂN',
        items: [
          { key: 'profile', label: 'Hồ sơ của tôi', icon: '👤', to: '/profile' },
        ]
      }
    ],
    manager: [
      {
        title: 'TRANG CHÍNH',
        items: [
          { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
          { key: 'events-manage', label: 'Quản lý sự kiện', icon: '🛠️', to: '/event-manager/events' },
        ]
      },
      {
        title: 'CÁ NHÂN',
        items: [
          { key: 'profile', label: 'Hồ sơ của tôi', icon: '👤', to: '/profile' },
        ]
      }
    ],
    admin: [
      {
        title: 'TRANG CHÍNH',
        items: [
          { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
          { key: 'events-manage', label: 'Quản lý sự kiện', icon: '🛠️', to: '/admin/events' },
        ]
      },
      {
        title: 'QUẢN TRỊ',
        items: [
          { key: 'user-management', label: 'Quản lý Người Dùng', icon: '👥', to: '/admin/users' },
          { key: 'export-data', label: 'Xuất dữ liệu', icon: '📊', to: '/admin/export' },
        ]
      },
      {
        title: 'CÁ NHÂN',
        items: [
          { key: 'profile', label: 'Hồ sơ của tôi', icon: '👤', to: '/profile' },
        ]
      }
    ],
  };

  const groups = menuGroups[role] || menuGroups.volunteer;

  const handleNavigate = (to) => {
    navigate(to);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div className="logo-text">
            <div className="logo-main">Volunteer Hub</div>
            <div className="logo-sub">Nền tảng tình nguyện</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {groups.map((group, idx) => (
          <div key={idx} className="nav-group">
            <p className="nav-group-title">{group.title}</p>
            <ul className="nav-items">
              {group.items.map((item) => (
                <li 
                  key={item.key} 
                  className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.to)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
