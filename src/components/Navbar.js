// import React from 'react';

// const Navbar = () => {
//   return (
//     <>
//       <nav style={styles.nav}>
//         <img src="/logo1.png" alt="Logo" style={styles.logo} />
//         <h2 style={styles.title}>Stenosis Detect</h2>
//         <ul style={styles.navLinks}>
//           <li><a href="#home" style={styles.link}>HOME</a></li>
//           <li><a href="#about" style={styles.link}>ABOUT</a></li>
//           <li><a href="#papers" style={styles.link}>PAPERS</a></li>
//           <li><a href="#contact" style={styles.link}>CONTACT</a></li>
//         </ul>
//       </nav>
//     </>
//   );
// };

// const styles = {
//   nav: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '10px 30px',
//     backgroundColor: '#003366',
//     color: 'white',
//     flexWrap: 'wrap'
//   },
//   logo: {
//     height: '50px'
//   },
//   title: {
//     margin: '0'
//   },
//   navLinks: {
//     listStyle: 'none',
//     display: 'flex',
//     gap: '20px',
//     margin: 0,
//     padding: 0
//   },
//   link: {
//     color: 'white',
//     textDecoration: 'none',
//     fontWeight: 'bold'
//   }
// };

// export default Navbar;


import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <img src="/logo1.png" alt="Logo" style={styles.logo} />
      <h2 style={styles.title}>Stenosis Detect</h2>
      <ul style={styles.navLinks}>
        <li><a href="#home" style={styles.link}>HOME</a></li>
        <li><a href="#about" style={styles.link}>ABOUT</a></li>
        <li><a href="#papers" style={styles.link}>PAPERS</a></li>
        <li><a href="#contact" style={styles.link}>CONTACT</a></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    backgroundColor: '#003366',
    color: 'white',
    flexWrap: 'wrap'
  },
  logo: {
    height: '50px'
  },
  title: {
    margin: '0'
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default Navbar;
