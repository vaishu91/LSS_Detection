import React from 'react';

const About = () => {
  return (
    <section id="about" style={{...styles.about, paddingTop: '150px', marginTop: '-100px'}}>
      <div style={styles.overlay}>
        <h2>About Our Project</h2>
        <p>
          We are committed to advancing spinal health through technology. Our mission is to provide
          radiologists, clinicians, and medical professionals with an easy-to-use tool that streamlines
          the detection of lumbar spinal stenosis. Using machine learning models trained on high-
          quality MRI datasets, we offer reliable insights into spinal conditions like spinal canal
          stenosis, neural foraminal narrowing, and subarticular stenosis. Our goal is to improve
          diagnostic accuracy and patient outcomes by facilitating early detection.
        </p>
      </div>
    </section>
  );
};

const styles = {
  about: {
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
    maxWidth: '800px',
    top: '-40px',
    position: 'relative',
  }
};

export default About;
