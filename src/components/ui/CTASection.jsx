import './CTASection.css'

export default function CTASection() {
  const handleJoinNow = () => {
    const element = document.getElementById('member')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Sẵn Sàng Tạo Nên Sự Khác Biệt?</h2>
          <p className="cta-subtitle">
            Hãy gia nhập hàng ngàn tình nguyện viên đang thay đổi thế giới hôm nay
          </p>
          
          <button className="btn-cta-large" onClick={handleJoinNow}>
            Tham Gia Ngay
            <span className="btn-cta-arrow">→</span>
          </button>

          <div className="cta-features">
            <div className="cta-feature">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Không cần kinh nghiệm</span>
            </div>
            <div className="cta-feature">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Kết nối cộng đồng</span>
            </div>
            <div className="cta-feature">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Phát triển kỹ năng</span>
            </div>
          </div>
        </div>

        <div className="cta-decoration">
          <div className="decoration-blob blob-1"></div>
          <div className="decoration-blob blob-2"></div>
          <div className="decoration-blob blob-3"></div>
        </div>
      </div>
    </section>
  )
}
