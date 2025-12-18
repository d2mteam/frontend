/**
 * Toast Notification Service
 * Handles all API responses and converts them to toast notifications
 */

export const handleApiResponse = async (response) => {
  const data = await response.json();

  // Nếu response có toastType, trả về thông tin để hiển thị toast
  if (data.toastType) {
    return {
      type: data.toastType,
      message: data.message,
      success: data.success,
      data: data.data || null,
    };
  }

  return {
    type: response.ok ? 'success' : 'error',
    message: data.message || 'Operation completed',
    success: response.ok,
    data: data.data || null,
  };
};

/**
 * Toast Types:
 * - success: Xanh lá cây (Green)
 * - error: Đỏ (Red)
 * - warning: Vàng (Yellow)
 * - info: Xanh dương (Blue)
 */

export const toastMessages = {
  // Auth Messages
  registerSuccess: 'Đăng ký thành công! Vui lòng đăng nhập.',
  registerError: 'Đăng ký thất bại. Vui lòng thử lại.',
  loginSuccess: 'Đăng nhập thành công!',
  loginError: 'Email hoặc mật khẩu không chính xác.',
  logoutSuccess: 'Đăng xuất thành công!',
  profileUpdateSuccess: 'Cập nhật hồ sơ thành công!',
  profileUpdateError: 'Cập nhật hồ sơ thất bại.',

  // Event Messages
  eventCreated: 'Sự kiện được tạo thành công!',
  eventCreatedPending: 'Sự kiện được tạo thành công! Đang chờ phê duyệt.',
  eventUpdateSuccess: 'Sự kiện được cập nhật thành công!',
  eventUpdateError: 'Cập nhật sự kiện thất bại.',
  eventRegisteredSuccess: 'Đăng ký sự kiện thành công!',
  eventRegisteredError: 'Đăng ký sự kiện thất bại.',
  eventFull: 'Sự kiện đã đầy. Không thể đăng ký.',
  alreadyRegistered: 'Bạn đã đăng ký sự kiện này.',
  eventApproved: 'Sự kiện được phê duyệt thành công!',
  eventRejected: 'Sự kiện được từ chối.',

  // Blood Donation Messages
  bloodDonationSuccess: 'Đăng ký hiến máu thành công! Chúng tôi sẽ liên hệ sớm.',
  bloodDonationError: 'Đăng ký hiến máu thất bại.',
  bloodDonationDuplicate: 'Email này đã được đăng ký trước đó.',
  bloodStatusUpdated: 'Cập nhật trạng thái hiến máu thành công!',

  // Membership Messages
  membershipSuccess: 'Đơn tham gia được gửi thành công! Vui lòng kiểm tra email xác nhận.',
  membershipError: 'Tạo thành viên thất bại.',
  membershipDuplicate: 'Email này đã được đăng ký trước đó.',
  membershipApproved: 'Thành viên được chấp thuận thành công!',
  membershipRejected: 'Thành viên bị từ chối.',

  // General Messages
  loadingError: 'Tải dữ liệu thất bại.',
  networkError: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.',
  serverError: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  unauthorized: 'Bạn không có quyền truy cập.',
  forbidden: 'Truy cập bị từ chối.',
  notFound: 'Không tìm thấy dữ liệu.',
};

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: success, error, warning, info
 */
export const showNotification = (message, type = 'info') => {
  // 🆕 Xử lý nếu message là Object lỗi hoặc undefined/null
  let displayMessage = message;
  
  if (typeof message === 'object' && message !== null) {
    displayMessage = 
      message.message || 
      message.error || 
      message.response?.data?.message || 
      message.response?.data?.error ||
      "Đã có lỗi xảy ra (Unknown Error)";
  }
  
  // Xử lý nếu message bị undefined/null
  if (!displayMessage || displayMessage === '') {
    displayMessage = "Thao tác thất bại";
  }

  // Check if NotificationContext exists
  if (window.showToast) {
    window.showToast(displayMessage, type);
  } else {
    // Fallback to browser alert
    console.log(`[${type.toUpperCase()}] ${displayMessage}`);
    
    // Use browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(type === 'error' ? '❌ Lỗi' : type === 'success' ? '✅ Thành công' : 'ℹ️ Thông báo', {
        body: displayMessage,
        icon: '/logo.png',
        tag: 'toast-notification'
      });
    } else {
      // Create simple toast element
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
      `;
      toast.textContent = displayMessage;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }
  }
};

export default toastMessages;
