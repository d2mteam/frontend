import { useState } from 'react'
import './TestimonialSlider.css'

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Thị A',
      role: 'Sinh viên năm 2',
      avatar: '👩‍🎓',
      quote: 'Tham gia câu lạc bộ đã thay đổi hoàn toàn cách tôi nhìn nhận về cuộc sống. Tôi không chỉ giúp đỡ người khác mà còn phát triển bản thân rất nhiều.',
      rating: 5
    },
    {
      id: 2,
      name: 'Trần Văn B',
      role: 'Sinh viên năm 1',
      avatar: '👨‍🎓',
      quote: 'Đây là những người bạn tuyệt vời và những hoạt động rất ý nghĩa. Mỗi sự kiện đều để lại dấu ấn sâu sắc trong lòng tôi.',
      rating: 5
    },
    {
      id: 3,
      name: 'Lê Thị C',
      role: 'Sinh viên năm 3',
      avatar: '👩‍🎓',
      quote: 'Tình nguyện không chỉ là đóng góp cho cộng đồng, mà còn là cơ hội để tôi hiểu thêm về chính mình và các giá trị sống.',
      rating: 5
    },
  ]

  const next = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  const testimonial = testimonials[currentIndex]

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">Lời Nói Của Tình Nguyện Viên</h2>
        <p className="testimonials-subtitle">Nghe chia sẻ từ những thành viên của chúng tôi</p>

        <div className="testimonial-slider">
          <div className="testimonial-card">
            <div className="testimonial-rating">
              {'⭐'.repeat(testimonial.rating)}
            </div>
            
            <p className="testimonial-quote">"{testimonial.quote}"</p>
            
            <div className="testimonial-author">
              <div className="author-avatar">{testimonial.avatar}</div>
              <div className="author-info">
                <p className="author-name">{testimonial.name}</p>
                <p className="author-role">{testimonial.role}</p>
              </div>
            </div>
          </div>

          <div className="slider-controls">
            <button 
              className="slider-button slider-prev" 
              onClick={prev}
              aria-label="Previous testimonial"
            >
              ←
            </button>
            
            <div className="slider-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="slider-button slider-next" 
              onClick={next}
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
