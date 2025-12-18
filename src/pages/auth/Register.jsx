import React, { useState } from 'react';
import '../../assets/styles/login_register.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// import backgroundImg from '../../assets/images/background.webp'

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('volunteer');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Volunteer fields
    phone: '',
    dateOfBirth: '',
    address: '',
    interests: '',
    // Manager fields
    organizationName: '',
    organizationAddress: '',
    organizationPhone: '',
    position: ''
  });

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    // Password phải là "123456789abc"
    if (formData.password !== '123456789abc') {
      alert('Mật khẩu phải là: 123456789abc');
      return;
    }

    // Role-specific validation
    if (selectedRole === 'volunteer') {
      if (!formData.phone || !formData.dateOfBirth || !formData.address) {
        alert('Vui lòng điền đầy đủ thông tin volunteer');
        return;
      }
    }

    if (selectedRole === 'manager') {
      if (!formData.organizationName || !formData.organizationAddress || 
          !formData.organizationPhone || !formData.position) {
        alert('Vui lòng điền đầy đủ thông tin tổ chức');
        return;
      }
    }

    try {
      // Call backend API
      const roleMap = { 'volunteer': 'USER', 'manager': 'EVENT_MANAGER' };
      const role = roleMap[selectedRole];

      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Đăng ký thất bại');
      }

      // Success message
      if (selectedRole === 'manager') {
        alert('Đăng ký thành công! Tài khoản Manager của bạn đang chờ admin phê duyệt. Bạn sẽ nhận được thông báo qua email khi được duyệt.');
      } else {
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      }
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  }

  const handleBackHome = () => {
    navigate('/');
  }

  return (
    <div className="register-page">
      <div className="background-overlay"></div>
      <div className="register-container">
        <button 
          className="back-home-btn" 
          onClick={handleBackHome}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}
        >
          ← Back to Home
        </button>
        <h1 className="main-title">VolunteerHub</h1>
        <p className="subtitle">Tạo tài khoản của bạn</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Họ Tên</label>
          <input 
            type="text" 
            id="fullname" 
            name="fullname" 
            required 
            value={formData.fullname}
            onChange={handleInputChange}
          />

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={formData.email}
            onChange={handleInputChange}
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={formData.password}
            onChange={handleInputChange}
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            required 
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />

          <label className="role-label">Đăng ký với chức năng:</label>
          <div className="role-selector">
            {['volunteer', 'manager'].map((role) => (
              <button
                key={role}
                type="button"
                className={`role-btn ${selectedRole === role ? 'selected' : ''}`}
                onClick={() => handleRoleClick(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Volunteer-specific fields */}
          {selectedRole === 'volunteer' && (
            <>
              <label htmlFor="phone">Số điện thoại</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required 
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
              />

              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input 
                type="date" 
                id="dateOfBirth" 
                name="dateOfBirth" 
                required 
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />

              <label htmlFor="address">Địa chỉ</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                required 
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ của bạn"
              />

              <label htmlFor="interests">Lĩnh vực quan tâm</label>
              <textarea 
                id="interests" 
                name="interests" 
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="VD: Môi trường, giáo dục, y tế..."
                rows="3"
              />
            </>
          )}

          {/* Manager-specific fields */}
          {selectedRole === 'manager' && (
            <>
              <label htmlFor="organizationName">Tên tổ chức</label>
              <input 
                type="text" 
                id="organizationName" 
                name="organizationName" 
                required 
                value={formData.organizationName}
                onChange={handleInputChange}
                placeholder="Nhập tên tổ chức"
              />

              <label htmlFor="organizationAddress">Địa chỉ tổ chức</label>
              <input 
                type="text" 
                id="organizationAddress" 
                name="organizationAddress" 
                required 
                value={formData.organizationAddress}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ tổ chức"
              />

              <label htmlFor="organizationPhone">Số điện thoại tổ chức</label>
              <input 
                type="tel" 
                id="organizationPhone" 
                name="organizationPhone" 
                required 
                value={formData.organizationPhone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại tổ chức"
              />

              <label htmlFor="position">Chức vụ</label>
              <input 
                type="text" 
                id="position" 
                name="position" 
                required 
                value={formData.position}
                onChange={handleInputChange}
                placeholder="VD: Giám đốc, Quản lý dự án..."
              />
            </>
          )}

          <button type="submit" className="create-account-btn">Đăng ký</button>
        </form>

        <p className="bottom-text">
          Bạn đã có tài khoản?{' '}
          <a onClick={handleLogin} className="link">Đăng nhập tại đây</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
