import { useState } from 'react'
import '../styles/Projects.css'

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: 'Chiến Dịch Dọc Dẹp Cộng Đồng',
      category: 'Môi Trường',
      categoryColor: 'Environment',
      description: 'Tổ chức các sáng kiến dọc dẹp cộng đồng đều đặn để bảo vệ môi trường.',
      image: 'https://images.unsplash.com/photo-1559027615-cd3628902d4a?w=1080&h=192&fit=crop&q=80',
      date: 'Tháng 9 năm 2024',
      impact: '5 tấn rác được thu gọn',
      status: null,
      upcoming: false,
      details: 'Chúng tôi đã tổ chức sự kiện dọc dẹp quy mô lớn với hơn 200 tình nguyện viên dọc dẹp công viên và sông ngòi địa phương.'
    },
    {
      id: 2,
      title: 'Chương Trình Hỗ Trợ Giáo Dục',
      category: 'Giáo Dục',
      categoryColor: 'Education',
      description: 'Cung cấp dạy kèm miễn phí và tài nguyên giáo dục cho trẻ em khó khăn.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1080&h=192&fit=crop&q=80',
      date: 'Tháng 10 năm 2024',
      impact: 'Hỗ trợ hơn 150 học sinh',
      status: null,
      upcoming: false,
      details: 'Các tình nguyện viên dành cuối tuần dạy tiếng Anh, Toán và Khoa học cho các em học sinh không có điều kiện học chính quy.'
    },
    {
      id: 3,
      title: 'Chiến Dịch Phân Phối Thực Phẩm',
      category: 'Trợ Giúp',
      categoryColor: 'Relief',
      description: 'Phân phối thực phẩm và nhu yếu phẩm thiết yếu cho cộng đồng khó khăn.',
      image: 'https://images.unsplash.com/photo-1559027615-cd3628902d4a?w=1080&h=192&fit=crop&q=80',
      date: 'Tháng 11 năm 2024',
      impact: 'Phân phối hơn 1000 suất ăn',
      status: 'Hoàn thành',
      upcoming: false,
      details: 'Sáng kiến phân phối thực phẩm quy mô lớn mang bữa ăn bổ dưỡng đến những người dân cần giúp đỡ.'
    },
    {
      id: 4,
      title: 'Sáng Kiến Trại Y Tế',
      category: 'Chăm Sóc Sức Khỏe',
      categoryColor: 'Healthcare',
      description: 'Trại y tế miễn phí và khám sức khỏe cho cộng đồng nông thôn.',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1080&h=192&fit=crop&q=80',
      date: 'Tháng 12 năm 2024',
      impact: 'Hơn 500 lượt khám sức khỏe',
      status: null,
      upcoming: false,
      details: 'Các tình nguyện viên đã tổ chức buổi tư vấn sức khỏe và khám bệnh miễn phí.'
    },
    {
      id: 5,
      title: 'Hội Thảo Kỹ Năng Số',
      category: 'Giáo Dục',
      categoryColor: 'Education',
      description: 'Dạy kỹ năng số và kiến thức tin học cho những người còn hạn chế.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1080&h=192&fit=crop&q=80',
      date: 'Tháng 1 năm 2025',
      impact: 'Đào tạo hơn 100 người',
      status: null,
      upcoming: true,
      details: 'Thu hẹp khoảng cách số bằng cách dạy kỹ năng tin học và internet cơ bản.'
    },
    {
      id: 6,
      title: 'Chiến Dịch Trồng Cây',
      category: 'Môi Trường',
      categoryColor: 'Environment',
      description: 'Sáng kiến trồng cây quy mô lớn cho bảo tồn môi trường.',
      image: 'https://images.unsplash.com/photo-1559027615-cd3628902d4a?w=1080&h=192&fit=crop&q=80',
      date: 'Tháng 2 năm 2025',
      impact: 'Trồng hơn 5000 cây',
      status: null,
      upcoming: true,
      details: 'Dự án môi trường hợp tác để chống biến đổi khí hậu và khôi phục không gian xanh.'
    }
  ]



  return (
    <div className="projects-page">
      {/* Header */}
      <div className="projects-header" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1559027615-cd3628902d4a?w=1200&h=400&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="projects-header-overlay"></div>
        <div className="projects-header-content">
          <h1>Các Dự Án Của Chúng Tôi</h1>
          <p>Tạo ra sự khác biệt thực sự thông qua các sáng kiến ý nghĩa</p>
        </div>
      </div>

      {/* Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-grid">
            {['Tất Cả Dự Án', 'Giáo Dục', 'Sức Khỏe', 'Môi Trường', 'Xã Hội'].map((filter, i) => (
              <button key={filter} className="filter-btn">
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="projects-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project, i) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`project-card ${project.upcoming ? 'upcoming' : ''}`}
              >
                {/* Image */}
                <div className="project-image-wrapper group">
                  <div
                    className="project-image"
                    style={{
                      backgroundImage: `url("${project.image}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {project.status && (
                      <div className="status-badge status-completed">
                        {project.status}
                      </div>
                    )}
                    <div className={`category-badge category-${project.categoryColor}`}>
                      {project.category}
                    </div>
                    
                    {/* Overlay with arrow icon */}
                    <div className="project-overlay">
                      <div className="overlay-icon">
                        →
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-meta">
                    <span>📅 {project.date}</span>
                    <span>✨ {project.impact}</span>
                  </div>

                  <button className="btn btn-primary">
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div
                  className="modal-image"
                  style={{
                    backgroundImage: `url("${selectedProject.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <h2>{selectedProject.title}</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-badges">
              <span className="badge badge-primary">{selectedProject.category}</span>
              {selectedProject.upcoming && (
                <span className="badge badge-secondary">Sắp Tới</span>
              )}
            </div>

            <div className="modal-details">
              <p><strong>Ngày:</strong> {selectedProject.date}</p>
              <p><strong>Tác Động:</strong> {selectedProject.impact}</p>
              <p className="modal-description">{selectedProject.details}</p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary">
                Tham Gia Dự Án
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="btn btn-outline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Tác Động Của Chúng Tôi Qua Số Liệu</h2>
          
          <div className="stats-grid">
            {[
              { num: '50+', label: 'Dự Án Hoàn Thành' },
              { num: '5000+', label: 'Cuộc Sống Được Cải Thiện' },
              { num: '10000+', label: 'Giờ Tình Nguyện' },
              { num: '500+', label: 'Tình Nguyện Viên Tích Cực' },
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{stat.num}</div>
                <p className="stat-desc">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

