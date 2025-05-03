import React from 'react';

const Home = () => {
  return (
    <section id="home" style={{...styles.home, paddingTop: '150px', marginTop: '-100px'}}>
      <div style={styles.overlay}>
        <h1>Welcome,</h1>
        <p>
          We present you the solution for the early detection and management of lumbar spinal stenosis. 
          Our innovative platform utilizes Deep Learning techniques to analyze the MRI images and provide 
          accurate assessments, helping healthcare professionals to make informed decisions.
        </p>
        <button>Upload image file</button>
      </div>
    </section>
  );
};

const styles = {
  home: {
    backgroundImage: 'url("bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '70px',
    borderRadius: '10px',
    maxWidth: '700px',
    position: 'relative',
    top: '-40px', 
  }
};

export default Home;
