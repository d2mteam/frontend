import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/header_new.css'

export default function Header({ setCurrentPage, currentPage }) {
  const navigate = useNavigate()
  const { openAuth, user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'sukien', label: 'Sự kiện' },
    { id: 'aboutus', label: 'Về chúng tôi' },
    { id: 'contact', label: 'Liên hệ' },
  ]

  const handleNavClick = (sectionId) => {
    setCurrentPage(sectionId)
    setIsMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogoClick = () => {
    handleNavClick('home')
  }

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo & Brand */}
        <div className="logo-section" onClick={handleLogoClick}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div className="logo-text">
            <div className="logo-main">Volunteer Hub</div>
            <div className="logo-sub">Nền tảng tình nguyện</div>
            <div className="logo-tagline">Make a Difference Today</div>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="nav-menu desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-right">
          {/* Desktop */}
          {!user ? (
            <div className="auth-buttons desktop-auth">
              <button 
                className="btn-login"
                onClick={() => openAuth('login')}
              >
                Đăng nhập
              </button>
              <button 
                className="btn-signup-header"
                onClick={() => openAuth('signup')}
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <div 
              className="user-avatar-wrapper"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="menu-divider"></div>
                  <button 
                    className="menu-item"
                    onClick={() => navigate('/dashboard')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    Trang chi tiết
                  </button>
                  <button 
                    className="menu-item"
                    onClick={logout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile */}
          <button
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Auth Buttons or User Info */}
        {!user ? (
          <div className="mobile-auth-buttons">
            <button 
              className="btn-signup-header"
              onClick={() => { openAuth('signup'); setIsMenuOpen(false); }}
            >
              Đăng ký
            </button>
            <button 
              className="btn-login"
              onClick={() => { openAuth('login'); setIsMenuOpen(false); }}
            >
              Đăng nhập
            </button>
          </div>
        ) : (
          <div className="mobile-user-menu">
            <div className="mobile-user-info">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div>
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <button 
              className="mobile-menu-btn"
              onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
            >
              Trang chi tiết
            </button>
            <button 
              className="mobile-menu-btn"
              onClick={() => { logout(); setIsMenuOpen(false); }}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
