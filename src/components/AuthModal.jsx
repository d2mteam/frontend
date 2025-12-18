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
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
        // Redirect to landing page after successful login
        navigate('/');
      } else {
        // Validate signup
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp");
        }
        if (!formData.agreeTerms) {
          throw new Error("Vui lòng đồng ý với điều khoản sử dụng");
        }
        
        // Send signup request with role
        await authService.signup(formData.email, formData.password, selectedRole);
        
        if (selectedRole === 'EVENT_MANAGER') {
          alert("Đăng ký thành công! Tài khoản Manager của bạn đang chờ Admin duyệt. Bạn sẽ nhận được thông báo qua email khi tài khoản được kích hoạt.");
        } else {
          alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ với vai trò Volunteer.");
        }
        
        switchMode('login');
        setFormData({ email: '', password: '', confirmPassword: '', agreeTerms: false, role: 'USER' });
        setSelectedRole('USER');
      }
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra");
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
        {/* Close button */}
        <button className="auth-close-btn" onClick={closeAuth}>
          <X size={24} />
        </button>

        {/* Left Panel - Visual & Branding */}
        <div className="auth-left-panel">
          <div className="auth-left-content">
            <h2 className="auth-headline">
              Bạn có muốn <span className="text-highlight">tình nguyện</span> ươm mầm xanh?
            </h2>
            <ul className="auth-feature-list">
              <li>Thời gian linh hoạt theo lịch của bạn</li>
              <li>Phù hợp với dự án bạn đã chọn</li>
              <li>Không yêu cầu kinh nghiệm tình nguyện trước đó</li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Form */}
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
              <label htmlFor="password" className="auth-label">Mật khẩu</label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu..."
                  className="auth-input"
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

                {/* Role selection for signup */}
                <div className="auth-input-group">
                  <label className="auth-label">
                    Đăng ký với vai trò 
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '8px' }}>
                      (Chọn vai trò phù hợp)
                    </span>
                  </label>
                  <div className="auth-role-buttons" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <button 
                      type="button" 
                      className={`auth-role-btn auth-role-volunteer ${selectedRole === 'USER' ? 'active' : ''}`}
                      onClick={() => handleRoleSelect('USER')}
                    >
                      <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Volunteer
                      <span style={{ fontSize: '0.7rem', color: '#10b981' }}>✓ Kích hoạt ngay</span>
                    </button>

                    <button 
                      type="button" 
                      className={`auth-role-btn auth-role-manager ${selectedRole === 'EVENT_MANAGER' ? 'active' : ''}`}
                      onClick={() => handleRoleSelect('EVENT_MANAGER')}
                    >
                      <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Manager
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>⏳ Chờ duyệt</span>
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                    💡 <strong>Volunteer:</strong> Kích hoạt ngay lập tức | <strong>Manager:</strong> Cần Admin duyệt (1-2 ngày)
                  </p>
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

            {authMode === 'login' && (
              <>
                <div className="auth-divider">
                  <span>Hoặc chọn vai trò để đăng nhập</span>
                </div>

                <div className="auth-role-buttons">
                  <button 
                    type="button" 
                    className={`auth-role-btn auth-role-volunteer ${selectedRole === 'USER' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('USER')}
                  >
                    <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Volunteer
                  </button>

                  <button 
                    type="button" 
                    className={`auth-role-btn auth-role-manager ${selectedRole === 'EVENT_MANAGER' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('EVENT_MANAGER')}
                  >
                    <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Manager
                  </button>

                  <button 
                    type="button" 
                    className={`auth-role-btn auth-role-admin ${selectedRole === 'ADMIN' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('ADMIN')}
                  >
                    <svg className="role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin
                  </button>
                </div>
              </>
            )}

            {authMode === 'signup' && (
              <>
                <div className="auth-divider">
                  <span>Hoặc đăng ký bằng</span>
                </div>

                <button type="button" className="auth-google-btn">
                  <svg className="google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Đăng ký với Google
                </button>
              </>
            )}

            <div className="auth-footer-link">
              {authMode === 'login' ? (
                <>
                  Bạn chưa có tài khoản?{' '}
                  <button type="button" onClick={() => switchMode('signup')} className="auth-switch-link">
                    Đăng ký
                  </button>
                </>
              ) : (
                <>
                  Bạn đã có tài khoản?{' '}
                  <button type="button" onClick={() => switchMode('login')} className="auth-switch-link">
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
