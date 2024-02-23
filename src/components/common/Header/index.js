// Header.js

import React, { useState } from 'react';
import './styles.css';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLinkClick = () => {
    setMenuVisible(false);
  };

  window.addEventListener('scroll', () => {
    setScrolled(window.scrollY > 0);
  });

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className='menu-bar' onClick={handleMenuToggle}>
        <div className={`menu-icon ${menuVisible ? 'open' : ''}`}></div>
        <div className={`menu-icon ${menuVisible ? 'open' : ''}`}></div>
        <div className={`menu-icon ${menuVisible ? 'open' : ''}`}></div>
      </div>
      <div className='gradient'></div>
      <div className={`links ${menuVisible ? 'visible' : ''}`}>
        <Link to="/" className={currentPath === "/" ? "active" : ""} onClick={handleLinkClick}>Signup</Link>
        <Link to="/podcasts" className={currentPath === "/podcasts" ? "active" : ""} onClick={handleLinkClick}>Podcasts</Link>
        <Link to="/create-a-podcast" className={currentPath === "/create-a-podcast" ? "active" : ""} onClick={handleLinkClick}>Start A Podcast</Link>
        <Link to="/profile" className={currentPath === "/profile" ? "active" : ""} onClick={handleLinkClick}>Profile</Link>
      </div>
    </div>
  );
}

export default Header;
