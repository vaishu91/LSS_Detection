import React from 'react';

const Papers = () => {
  return (
    <section id="papers" style={styles.papers}>
      <div style={styles.overlay}>
        <h2>Our Research Paper</h2>
        <p>
          Explore our research paper on lumbar spinal stenosis detection:  
          Here, you can access papers that detail our approach to detecting spinal stenosis and classify
          its severity, the datasets we use, and the clinical implications of early diagnosis.
        </p>
        <p>
          <strong>Research paper:</strong> Deep Learning for Detection and Severity Classification of Lumbar Spinal Stenosis in MRI Scans  
          <br />
          <strong>Dataset:</strong> RSNA 2024 Lumbar Spine Degenerative Classification
        </p>
        <a href="#" style={styles.button}>Click here</a>
      </div>
    </section>
  );
};

const styles = {
  papers: {
    backgroundImage: 'url("bg.jpg")', // Same background as Home
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    scrollMarginTop: '80px' // Adjust for anchor scrolling
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '70px',
    borderRadius: '10px',
    maxWidth: '700px'
  },
  button: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#00cccc',
    color: 'black',
    textDecoration: 'none',
    borderRadius: '5px'
  }
};

export default Papers;
