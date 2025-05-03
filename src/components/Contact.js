import React from 'react';

const Contact = () => {
  return (
    <section id="contact" style={styles.section}>
      <h2>Contact Us</h2>
      <p>We'd love to hear from you! Contact us on:</p>
      <p>Email: your-email@example.com</p>
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

export default Contact;
