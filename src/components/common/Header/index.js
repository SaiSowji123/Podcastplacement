import React, { useEffect, useState } from 'react';
import './styles.css';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className='gradient'></div>
      <div className='links'>
        <Link to="/" className={currentPath === "/" ? "active" : ""}>Signup</Link>
        <Link to="/podcasts" className={currentPath === "/podcasts" ? "active" : ""}>Podcasts</Link>
        <Link to="/create-a-podcast" className={currentPath === "/create-a-podcast" ? "active" : ""}>Start A Podcast</Link>
        <Link to="/profile" className={currentPath === "/profile" ? "active" : ""}>Profile</Link>
      </div>
    </div>
  );
}

export default Header;
