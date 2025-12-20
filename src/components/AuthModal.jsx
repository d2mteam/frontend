import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import * as authService from '../services/authService'
import './AuthModal.css'

export default function AuthModal() {
  const navigate = useNavigate();
  const { isAuthOpen, closeAuth, authMode, switchMode, login } = useAuth();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    agreeTerms: false,
    role: 'USER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('USER');

  // Handler for role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp");
        }
        if (!formData.password || formData.password.length < 8 || /\s/.test(formData.password)) {
          throw new Error("Mật khẩu phải tối thiểu 8 ký tự và không chứa khoảng trắng");
        }
        if (!formData.agreeTerms) {
          throw new Error("Vui lòng đồng ý với điều khoản sử dụng");
        }
        
        await authService.signup(formData.email, formData.password, selectedRole);
        
        if (selectedRole === 'EVENT_MANAGER') {
          alert("Đăng ký thành công! Kiểm tra email để xác minh. Tài khoản Manager của bạn sẽ chờ Admin duyệt sau khi xác minh.");
        } else {
          alert("Đăng ký thành công! Vui lòng kiểm tra email để xác minh, sau đó đăng nhập với vai trò Volunteer.");
        }
        
        switchMode('login');
        setFormData({ email: '', password: '', confirmPassword: '', agreeTerms: false, role: 'USER' });
        setSelectedRole('USER');
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || "";
      const reason = err?.response?.data?.reasonCode;
      const status = err?.response?.status ? ` (HTTP ${err.response.status})` : "";
      const combined = [reason ? `[${reason}]` : "", serverMsg || err.message].filter(Boolean).join(" ");
      setError(combined || `Đã có lỗi xảy ra${status}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isAuthOpen) return null;

  return (
    <div className="auth-overlay" onClick={closeAuth}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={closeAuth}>X
          <X size={24} />
        </button>

        <div className="auth-left-panel">
          <div className="auth-left-content">
            <h2 className="auth-headline">
              Bạn muốn tham gia <span className="text-highlight">tình nguyện</span>?
            </h2>
            <ul className="auth-feature-list">
              <li>Thời gian linh hoạt theo lịch của bạn</li>
              <li>Phù hợp với dự án bạn đã chọn</li>
              <li>Không yêu cầu kinh nghiệm tình nguyện trước đó</li>
            </ul>
          </div>
        </div>

        <div className="auth-right-panel">
          <h2 className="auth-form-title">
            {authMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
          </h2>

          {error && (
            <div className="auth-error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="email" className="auth-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập địa chỉ email..."
                className="auth-input"
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmPassword" className="auth-label">Mật khẩu</label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu..."
                  className="auth-input"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-icon"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <>
                <div className="auth-input-group">
                  <label htmlFor="confirmPassword" className="auth-label">Xác nhận mật khẩu</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu..."
                    className="auth-input"
                    autoComplete="off"
                    required
                  />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-eye-icon"
                    >
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                {/* Role selection for signup (chỉ hiển thị, không gửi kèm) */}
                <div className="auth-input-group">
                  <label className="auth-label">Đăng ký với vai trò</label>
                  <div className="auth-role-buttons" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <button 
                      type="button" 
                      className={`auth-role-btn auth-role-volunteer ${selectedRole === 'USER' ? 'active' : ''}`}
                      onClick={() => handleRoleSelect('USER')}
                    >
                      Volunteer
                      <span style={{ fontSize: '0.7rem', color: '#10b981' }}>✓ Kích hoạt ngay</span>
                    </button>

                    <button 
                      type="button" 
                      className={`auth-role-btn auth-role-manager ${selectedRole === 'EVENT_MANAGER' ? 'active' : ''}`}
                      onClick={() => handleRoleSelect('EVENT_MANAGER')}
                    >
                      Manager
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>⏳ Chờ duyệt</span>
                    </button>
                  </div>
                </div>

                <div className="auth-checkbox-group">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="auth-checkbox"
                  />
                  <label htmlFor="agreeTerms" className="auth-checkbox-label">
                    Bằng việc đăng ký, bạn đồng ý với{' '}
                    <a href="#" className="auth-link">điều khoản sử dụng</a> và{' '}
                    <a href="#" className="auth-link">chính sách bảo mật</a> của chúng tôi.
                  </label>
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (authMode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ NGAY')}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
