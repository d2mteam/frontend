import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getMyProfile, updateMyProfile, createMyProfile } from '../../services/userProfileService';
import { showNotification } from '../../services/toastService';
import { User, Mail, Edit, Save, X } from 'lucide-react';
import '../../assets/styles/unified-dashboard.css';

export default function UserProfileManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    email: '',
    username: '',
    avatarId: ''
  });

  useEffect(() => {
    if (!user?.userId) {
      showNotification('Vui lòng đăng nhập', 'error');
      navigate('/');
      return;
    }
    
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile(user.userId);
      
      if (response.success && response.data) {
        setProfile(response.data);
        setIsNewProfile(false);
        setEditing(false);
        setFormData({
          fullName: response.data.fullName || '',
          bio: response.data.bio || '',
          email: response.data.email || '',
          username: response.data.username || '',
          avatarId: response.data.avatarId || ''
        });
        console.info('Profile loaded:', response.data);
      } else {
        // Chưa có profile => bật chế độ tạo mới
        setProfile(null);
        setIsNewProfile(true);
        setEditing(true);
        setFormData({
          fullName: '',
          bio: '',
          email: user?.email || '',
          username: '',
          avatarId: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('Không thể tải thông tin hồ sơ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        fullName: formData.fullName,
        bio: formData.bio,
        email: formData.email,
        username: formData.username,
        avatarId: formData.avatarId
      };

      const response = isNewProfile
        ? await createMyProfile(user.userId, payload)
        : await updateMyProfile(user.userId, payload);
      
      if (response.success) {
        setProfile(response.data);
        setIsNewProfile(false);
        setEditing(false);
        showNotification(response.message || (isNewProfile ? 'Tạo hồ sơ thành công!' : 'Cập nhật thành công!'), 'success');
      } else {
        const rawMsg = response.raw ? JSON.stringify(response.raw) : '';
        showNotification(response.error || rawMsg || 'Lưu hồ sơ thất bại', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Có lỗi xảy ra khi lưu hồ sơ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || '',
      bio: profile?.bio || '',
      email: profile?.email || '',
      username: profile?.username || '',
      avatarId: profile?.avatarId || ''
    });
    setEditing(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header Section */}
        <header className="page-header">
          <div className="page-header-title">
            <h1 className="page-title">Hồ Sơ Cá Nhân 👤</h1>
            <p className="page-subtitle">{isNewProfile ? 'Tạo hồ sơ để hoàn tất đăng ký' : 'Quản lý thông tin cá nhân của bạn'}</p>
          </div>
          
          {/* Edit/Save Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!editing && !isNewProfile ? (
              <button 
                onClick={() => setEditing(true)}
                className="btn-primary"
              >
                <Edit className="w-5 h-5" />
                <span>Chỉnh Sửa</span>
              </button>
            ) : (
              <>
                {!isNewProfile && (
                  <button 
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    <X className="w-5 h-5" />
                    <span>Hủy</span>
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary"
                  style={{ 
                    backgroundColor: saving ? '#94a3b8' : '#10b981',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Đang lưu...' : (isNewProfile ? 'Tạo hồ sơ' : 'Lưu')}</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Đang tải hồ sơ...</p>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <div className="content-card">
              {/* Header with Avatar */}
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '2rem',
                color: 'white',
                borderRadius: '16px 16px 0 0',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {/* Avatar */}
                  <div className="user-avatar" style={{ 
                    width: '96px', 
                    height: '96px', 
                    fontSize: '2.25rem',
                    backgroundColor: 'white',
                    color: '#10b981'
                  }}>
                    {(formData.fullName || '?').charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div style={{ flex: 1 }}>
                    {editing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input"
                        style={{
                          fontSize: '1.875rem',
                          fontWeight: '700',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border: 'none',
                          marginBottom: '0.5rem'
                        }}
                        placeholder="Họ và tên"
                      />
                    ) : (
                      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {formData.fullName}
                      </h2>
                    )}
                    {editing ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                          Email
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            style={{ marginTop: '6px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
                            placeholder="email@example.com"
                          />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                          Username
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-input"
                            style={{ marginTop: '6px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
                            placeholder="username"
                          />
                        </label>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9 }}>
                          <Mail className="w-4 h-4" />
                          <span>{formData.email || 'Chưa có email'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Username: {formData.username || '-'}
                          </span>
                          <span
                            style={{
                              backgroundColor: '#ecfdf3',
                              color: '#065f46',
                              padding: '6px 10px',
                              borderRadius: '999px',
                              fontWeight: 700,
                              fontSize: '0.9rem'
                            }}
                          >
                            {profile.status || 'N/A'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div style={{ padding: '0 2rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  {/* Bio */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">
                      Giới thiệu bản thân
                    </label>
                    {editing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="form-textarea"
                        placeholder="Viết vài dòng về bản thân..."
                      />
                    ) : (
                      <div style={{
                        padding: '1rem 1.25rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        minHeight: '100px',
                        color: '#64748b',
                        fontSize: '0.95rem',
                        lineHeight: '1.6'
                      }}>
                        {formData.bio || 'Chưa có giới thiệu'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
