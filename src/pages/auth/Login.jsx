import React, { useState } from 'react';
import '../../assets/styles/login_register.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// import backgroundImg from '../../assets/images/background.webp'

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roleMap = { User: 'USER', Manager: 'EVENT_MANAGER', Admin: 'ADMIN' };
    const role = roleMap[selectedRole] || 'USER';

    const userObj = {
      id: Date.now(),
      name: email ? email.split('@')[0] : 'Người dùng',
      email,
      role,
    };

    login(userObj);
    
    // Redirect to landing page after login
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/register');
  }

  const handleBackHome = () => {
    navigate('/');
  }

  return (
    <div className="login-page">
      <div className="background-overlay"></div>
      <div className="login-container">
        <button 
          className="back-home-btn" 
          onClick={handleBackHome}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}
        >
          ← Back to Home
        </button>
        <h1 className="main-title">VolunteerHub</h1>
        <p className="subtitle">Đăng nhập tài khoản của bạn</p>

        <form id="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

          <label className="role-label">Đăng nhập với chức năng:</label>
          <div className="role-selector">
            {['User', 'Manager', 'Admin'].map((role) => (
              <button
                key={role}
                type="button"
                className={`role-btn ${selectedRole === role ? 'selected' : ''}`}
                onClick={() => handleRoleClick(role)}
              >
                {role}
              </button>
            ))}
          </div>

          <button type="submit" className="sign-in-btn">Đăng nhập</button>
        </form>

        {/* OAuth Divider */}
        <div className="oauth-divider">
          <span>hoặc đăng nhập với</span>
        </div>

        {/* OAuth Buttons */}
        <div className="oauth-buttons">
          <a href="http://localhost:8080/api/auth/google" className="btn-social btn-google">
            <svg className="oauth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </a>
          
          <a href="http://localhost:8080/api/auth/facebook" className="btn-social btn-facebook">
            <svg className="oauth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>
        </div>

        <p className="bottom-text">
          Bạn chưa có tài khoản?{' '}
          <a onClick={handleRegister} className="link">Đăng ký tại đây</a>
        </p>
      </div>
    </div>
  );
}

export default Login;