import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // Xử lý lỗi
      console.error('OAuth error:', error);
      alert('Đăng nhập thất bại: ' + error);
      navigate('/login');
      return;
    }

    if (token) {
      // Lưu token và lấy thông tin user
      localStorage.setItem('token', token);
      
      // Giải mã token để lấy thông tin user (hoặc gọi API /me)
      // Ở đây đơn giản hóa, bạn có thể gọi API để lấy user info
      fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          login(data.user);
          navigate('/dashboard');
        } else {
          throw new Error('Failed to get user info');
        }
      })
      .catch(err => {
        console.error('Error getting user info:', err);
        // Fallback: tạo user object tạm từ token
        const userObj = {
          id: Date.now(),
          name: 'OAuth User',
          email: 'oauth@example.com',
          role: 'volunteer',
        };
        login(userObj);
        navigate('/dashboard');
      });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Nunito, Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Đang xử lý đăng nhập...</h2>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4f46e5',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OAuthCallback;
