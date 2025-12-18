import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getMyProfile, updateMyProfile, createMyProfile } from '../../services/userProfileService';
import { showNotification } from '../../services/toastService';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit, Save, X
} from 'lucide-react';
import '../../assets/styles/unified-dashboard.css';

export default function UserProfileManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
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
        setFormData({
          fullName: response.data.fullName || '',
          bio: response.data.bio || '',
          phoneNumber: response.data.phoneNumber || '',
          address: response.data.address || '',
          dateOfBirth: response.data.dateOfBirth || ''
        });
        console.info('Profile loaded:', response.data);
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
      // Nếu chưa có profile, thử tạo mới, nếu có thì update
      const apiCall = profile ? updateMyProfile : createMyProfile;
      const response = await apiCall(user.userId, formData);
      
      if (response.success) {
        setProfile(response.data);
        setEditing(false);
        showNotification(response.message || 'Cập nhật thành công!', 'success');
      } else {
        showNotification(response.error || 'Cập nhật thất bại', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Có lỗi xảy ra khi cập nhật', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || '',
      bio: profile?.bio || '',
      phoneNumber: profile?.phoneNumber || '',
      address: profile?.address || '',
      dateOfBirth: profile?.dateOfBirth || ''
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
            <p className="page-subtitle">Quản lý thông tin cá nhân của bạn</p>
          </div>
          
          {/* Edit/Save Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!editing ? (
              <button 
                onClick={() => setEditing(true)}
                className="btn-primary"
              >
                <Edit className="w-5 h-5" />
                <span>Chỉnh Sửa</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  <X className="w-5 h-5" />
                  <span>Hủy</span>
                </button>
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
                  <span>{saving ? 'Đang lưu...' : 'Lưu'}</span>
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
        ) : !profile ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <h3 className="empty-state-title">Không tìm thấy hồ sơ</h3>
            <p className="empty-state-text">Vui lòng thử lại sau</p>
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
                    {formData.fullName.charAt(0).toUpperCase()}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9 }}>
                      <Mail className="w-4 h-4" />
                      <span>{user?.email || 'Chưa có email'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div style={{ padding: '0 2rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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

                  {/* Phone Number */}
                  <div className="form-group">
                    <label className="form-label">
                      <Phone className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Số điện thoại
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="0901234567"
                      />
                    ) : (
                      <div style={{
                        padding: '0.875rem 1.25rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        color: '#64748b',
                        fontSize: '0.95rem'
                      }}>
                        {formData.phoneNumber || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Ngày sinh
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div style={{
                        padding: '0.875rem 1.25rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        color: '#64748b',
                        fontSize: '0.95rem'
                      }}>
                        {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div style={{ gridColumn: '1 / -1' }} className="form-group">
                    <label className="form-label">
                      <MapPin className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} />
                      Địa chỉ
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
                      />
                    ) : (
                      <div style={{
                        padding: '0.875rem 1.25rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        color: '#64748b',
                        fontSize: '0.95rem'
                      }}>
                        {formData.address || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  paddingTop: '1.5rem', 
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ngày tạo: {profile.createdAt ? new Date(profile.createdAt).toLocaleString('vi-VN') : '-'}</span>
                    <span>Cập nhật: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString('vi-VN') : '-'}</span>
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
