import '../styles/Hero.css'

export default function About() {
  return (
    <section className="about-section" id="aboutus">
      <div className="about-container">
        <h2 className="section-title">
          Về Câu Lạc Bộ Tình Nguyện Arise Hearts
        </h2>
        <p className="section-description">
          Chúng tôi là một cộng đồng học sinh đam mê tạo nên những thay đổi tích cực thông qua các hoạt động tình nguyện.
        </p>

        {/* Feature Cards Grid */}
        <div className="feature-cards">
          {[
            { icon: '❤️', title: 'Phục Vụ Cộng Đồng', desc: 'Chúng tôi quan tâm sâu sắc đến cộng đồng mà chúng tôi phục vụ.' },
            { icon: '👥', title: 'Mạng Lưới Học Sinh', desc: 'Cùng nhau, chúng ta đạt được nhiều hơn và tạo ra những liên kết mạnh hơn.' },
            { icon: '🎯', title: 'Phát Triển Kỹ Năng', desc: 'Mỗi hành động được thúc đẩy bởi sứ mệnh và mục đích rõ ràng.' },
            { icon: '🌍', title: 'Tác Động Toàn Cầu', desc: 'Chúng tôi cố gắng đạt được kết quả tốt nhất trong tất cả các sáng kiến.' },
          ].map((card, i) => (
            <div 
              key={i} 
              className="feature-card"
            >
              <div className="feature-icon-container">
                <span className="feature-icon">{card.icon}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission Box */}
        <div className="vision-mission-box">
          <div className="vision-mission-text">
            <h2>Tầm Nhìn & Sứ Mệnh</h2>
            <div className="vision-item">
              <h3>Tầm Nhìn</h3>
              <p>Tạo dựng một cộng đồng các tình nguyện viên học sinh được trao quyền để chuyển đổi xã hội thông qua lòng trắc ẩn và hành động.</p>
            </div>
            <div className="mission-item">
              <h3>Sứ Mệnh</h3>
              <p>Truyền cảm hứng và thu hút học sinh tham gia vào những công việc tình nguyện có ý nghĩa tạo ra tác động tích cực bền vững trong giáo dục, y tế, môi trường và phát triển cộng đồng.</p>
            </div>
          </div>
          <div className="stats-grid">
            {[
              { number: '500+', label: 'Thành Viên Hoạt Động', color: 'blue-50' },
              { number: '50+', label: 'Dự Án', color: 'red-50' },
              { number: '10K+', label: 'Người Được Giúp Đỡ', color: 'green-50' },
              { number: '5', label: 'Năm Hoạt Động', color: 'yellow-50' },
            ].map((box, i) => (
              <div 
                key={i}
                className={`stat-box ${box.color}`}
              >
                <div className="stat-box-number">{box.number}</div>
                <div className="stat-box-label">{box.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
