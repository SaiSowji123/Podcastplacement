import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link, useLocation } from 'react-router-dom';

// Header component renders the navigation bar
function Header() {
  // State to manage menu visibility and scroll state
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hook to get the current location
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to toggle menu visibility
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  // Function to handle link click and close the menu
  const handleLinkClick = () => {
    setMenuVisible(false);
  };

  // Effect to track scrolling and update the scrolled state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Menu bar toggler */}
      <div className='menu-bar' onClick={handleMenuToggle}>
        <div className={`menu-icon ${menuVisible ? 'open' : ''}`}></div>
        <div className={`menu-icon ${menuVisible ? 'open' : ''}`}></div>
        <div className={`menu-icon ${menuVisible ? 'open' : ''}`}></div>
      </div>
      {/* Gradient effect */}
      <div className='gradient'></div>
      {/* Navigation links */}
      <div className={`links ${menuVisible ? 'visible' : ''}`}>
        {/* Link to Signup page */}
        <Link to="/" className={currentPath === "/" ? "active" : ""} onClick={handleLinkClick}>Signup</Link>
        {/* Link to Podcasts page */}
        <Link to="/podcasts" className={currentPath === "/podcasts" ? "active" : ""} onClick={handleLinkClick}>Podcasts</Link>
        {/* Link to Create a Podcast page */}
        <Link to="/create-a-podcast" className={currentPath === "/create-a-podcast" ? "active" : ""} onClick={handleLinkClick}>Start A Podcast</Link>
        {/* Link to Profile page */}
        <Link to="/profile" className={currentPath === "/profile" ? "active" : ""} onClick={handleLinkClick}>Profile</Link>
      </div>
    </div>
  );
}

export default Header;
