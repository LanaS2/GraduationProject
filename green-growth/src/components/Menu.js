import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faLeaf, faStethoscope, faCalendar } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`menu ${isOpen && isMobile ? 'open' : ''}`}>
      {isMobile && (
        <div className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      )}
      {(isOpen || !isMobile) && (
        <ul>
          <li><a href="/HomePage"><FontAwesomeIcon icon={faHome} /> Home</a></li>
          <li><a href="/crop-recommendation"><FontAwesomeIcon icon={faLeaf} /> Crop Recommendation</a></li>
          <li><a href="/mawso3a"><FontAwesomeIcon icon={faStethoscope} /> Disease Detection</a></li>
          <li><a href="/disease-recognition"><FontAwesomeIcon icon={faCalendar} /> My Garden Calendar</a></li>
        </ul>
      )}
    </div>
  );
};

export default Menu;
