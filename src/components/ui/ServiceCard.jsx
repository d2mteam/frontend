import './ServiceCard.css'

export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="service-card">
      <div className="service-icon-wrapper">
        <span className="service-icon">{icon}</span>
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
      <div className="service-line"></div>
    </div>
  )
}
