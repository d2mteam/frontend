import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About */}
          <div className="footer-section">
            <h3>Câu Lạc Bộ Tình Nguyện Arise Hearts</h3>
            <p>Cùng nhau tạo nên sự khác biệt, từng tình nguyện viên một.</p>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Thông Tin Liên Hệ</h4>
            <ul>
              <li>📍 Ho Chi Minh City, Vietnam</li>
              <li>📞 +84 28 5410 0000</li>
              <li>✉️ contact@arisehearts.org.vn</li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-section">
            <h4>Theo Dõi Chúng Tôi</h4>
            <ul>
              <li><a href="#">📷 Instagram</a></li>
              <li><a href="#">🎥 YouTube</a></li>
              <li><a href="#">💌 Email</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Liên Kết Nhanh</h4>
            <ul>
              <li><a href="#">Về Chúng Tôi</a></li>
              <li><a href="#">Sự Kiện</a></li>
              <li><a href="#">Quyên Góp</a></li>
              <li><a href="#">Tham Gia</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2025 Câu Lạc Bộ Tình Nguyện Arise Hearts. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}
