import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Volunteer Hub</h3>
            <p>Cùng nhau tạo nên sự khác biệt.</p>
          </div>

          <div className="footer-section">
            <h4>Thông Tin Liên Hệ</h4>
            <ul>
              <li>📍 Cầu Giấy, Hà Nội, Việt Nam</li>
              <li>📞 +84 325 561 813</li>
              <li>✉️ contact@volunteerhub.vn</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Theo Dõi Chúng Tôi</h4>
            <ul>
              <li><a href="#">📷 Instagram</a></li>
              <li><a href="#">🎥 YouTube</a></li>
              <li><a href="#">💌 Email</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Liên Kết Nhanh</h4>
            <ul>
              <li><a href="#">Về Chúng Tôi</a></li>
              <li><a href="#">Sự Kiện</a></li>
              <li><a href="#">Tham Gia</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Volunteer Hub - Cộng Đồng Tham Gia Tình Nguyện.</p>
        </div>
      </div>
    </footer>
  )
}
