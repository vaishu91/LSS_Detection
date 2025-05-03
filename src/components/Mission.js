import React from 'react';

const Mission = () => {
  return (
    <section id="about" style={styles.section}>
      <h2>About Our Project</h2>
      <p>
        We are committed to advancing spinal health through technology. Our mission is to provide
        radiologists, clinicians, and medical professionals with an easy-to-use tool that streamlines
        the detection of lumbar spinal stenosis. Using machine learning models trained on high-
        quality MRI datasets, we offer reliable insights into spinal conditions like spinal canal
        stenosis, neural foraminal narrowing, and subarticular stenosis. Our goal is to improve
        diagnostic accuracy and patient outcomes by facilitating early detection.
      </p>
    </section>
  );
};

const styles = {
  section: {
    padding: '50px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    margin: '20px'
  }
};

export default Mission;
