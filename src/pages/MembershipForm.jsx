import { useState } from 'react'
import '../styles/MembershipForm.css'

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    whyJoin: '',
    agreeTerms: false
  })

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const departments = [
    'Công nghệ thông tin',
    'Quản trị kinh doanh',
    'Kỹ thuật',
    'Thiết kế',
    'Marketing',
    'Khoa học xã hội',
    'Khác'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện')
      return
    }
    setSubmittedData(formData)
    setShowConfirmation(true)
    setTimeout(() => {
      setShowConfirmation(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        whyJoin: '',
        agreeTerms: false
      })
    }, 3000)
  }


  return (
    <div className="membership-page">
      {/* Header */}
      <div className="membership-header" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="membership-header-overlay"></div>
        <div 
          className="membership-header-content"
        >
          <h1>Trở Thành Thành Viên</h1>
          <p>Tham gia cộng đồng của chúng tôi và bắt đầu tạo nên sự khác biệt ngay hôm nay</p>
        </div>
      </div>

      {/* Content */}
      <div className="membership-content">
        <div className="membership-form-wrapper">
          <div className="membership-form-grid">
            {/* Form */}
            <div 
              className="membership-form"
            >
              <form onSubmit={handleSubmit} className="form">
                {/* Name */}
                <div 
                  className="form-group"
                >
                  <label className="form-label">Họ và tên *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    required
                    className="form-input"
                  />
                </div>

                {/* Email */}
                <div 
                  className="form-group"
                >
                  <label className="form-label">Địa chỉ Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="form-input"
                  />
                </div>

                {/* Phone */}
                <div 
                  className="form-group"
                >
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+84 123 456 789"
                    required
                    className="form-input"
                  />
                </div>

                {/* Department */}
                <div 
                  className="form-group"
                >
                  <label className="form-label">Khoa/Ngành *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Chọn khoa/ngành của bạn</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Why Join */}
                <div 
                  className="form-group"
                >
                  <label className="form-label">Tại sao bạn muốn tham gia? *</label>
                  <textarea
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleChange}
                    placeholder="Chia sẻ về động lực của bạn..."
                    rows="4"
                    required
                    className="form-textarea"
                  ></textarea>
                </div>

                {/* Terms Checkbox */}
                <div 
                  className="form-checkbox-group"
                >
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="agreeTerms" className="checkbox-label">
                    Tôi đồng ý với điều khoản và điều kiện cũng như chính sách bảo mật *
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-submit"
                >
                  Gửi đơn đăng ký
                </button>
              </form>
            </div>

            {/* Benefits Sidebar */}
            <div 
              className="membership-benefits"
            >
              <div className="benefits-card">
                <h3>Quyền lợi khi tham gia</h3>
                <ul className="benefits-list">
                  {[
                    'Tiếp cận các cơ hội tình nguyện độc quyền',
                    'Kết nối với các sinh viên cùng chí hướng',
                    'Phát triển kỹ năng lãnh đạo và cộng đồng',
                    'Giấy chứng nhận tham gia',
                    'Đào tạo và tài nguyên miễn phí',
                    'Sự kiện và hội thảo hàng tháng',
                  ].map((benefit, i) => (
                    <li 
                      key={i}
                    >
                      <span className="benefit-icon">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
          <div 
            className="confirmation-overlay"
          >
            <div 
              className="confirmation-popup"
            >
              <div 
                className="confirmation-icon"
              >
                ✓
              </div>
              <h2>Chào mừng!</h2>
              <p>Cảm ơn bạn, <strong>{submittedData?.name}</strong>!</p>
              <p>Chúng tôi đã nhận được đơn đăng ký và sẽ liên hệ với bạn qua {submittedData?.email}</p>
              <p className="confirmation-message">Hãy sẵn sàng tạo nên sự khác biệt!</p>
            </div>
          </div>
        )}
    </div>
  )
}