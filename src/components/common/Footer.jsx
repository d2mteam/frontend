import React from "react";
import "../../assets/styles/home.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h2 className="footer-logo">Volunteer Hub</h2>
          <p className="footer-desc">
            Nền tảng kết nối các hoạt động tình nguyện – cùng nhau lan tỏa yêu thương.
          </p>
        </div>

        <div className="footer-links">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><a href="/about">Về chúng tôi</a></li>
            <li><a href="/events">Sự kiện</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/faq">Hỏi đáp</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Kết nối</h3>
          <p>Email: <a href="mailto:volunteerhub@gmail.com">volunteerhub@gmail.com</a></p>
          <p>Hotline: 0123 456 789</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Volunteer Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
