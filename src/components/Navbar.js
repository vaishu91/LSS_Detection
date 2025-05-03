import React, { useState } from 'react';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('home'); // default to 'home'

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const getLinkStyle = (linkName) => ({
    ...styles.link,
    ...(activeLink === linkName ? styles.activeLink : {})
  });

  return (
    <nav style={styles.nav}>
      <div style={styles.logoTitle}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Stenosis Detect</h2>
      </div>
      <ul style={styles.navLinks}>
        <div>
          <li>
            <a
              href="#home"
              style={getLinkStyle('home')}
              onClick={() => handleLinkClick('home')}
            >
              HOME
            </a>
          </li>
        </div>
        <div>
          <li>
            <a
              href="#about"
              style={getLinkStyle('about')}
              onClick={() => handleLinkClick('about')}
            >
              ABOUT
            </a>
          </li>
        </div>
        <div>
          <li>
            <a
              href="#papers"
              style={getLinkStyle('papers')}
              onClick={() => handleLinkClick('papers')}
            >
              PAPERS
            </a>
          </li>
        </div>
        <div>
          <li>
            <a
              href="#contact"
              style={getLinkStyle('contact')}
              onClick={() => handleLinkClick('contact')}
            >
              CONTACT
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 50px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Semi-transparent dark cyan
    color: 'black',
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',  // Full width
    boxSizing: 'border-box'  // Ensures padding doesn't affect width
  },
  logoTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: '90px',
    margin: '-5px'
  },
  title: {
    margin: 0,
    fontSize: '30px',  // Increased title size
    fontWeight: 'bold'
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  link: {
    color: 'black',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '20px',  
    padding: '10px 18px',
    borderRadius: '20px',
    transition: 'all 0.3s ease'
  },
  activeLink: {
    backgroundColor: '#00cccc',
    color: '#003366'
  }
};

export default Navbar;
