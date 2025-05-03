// import React from 'react';

// const Research = () => {
//   return (
//     <section>
//       <h2>Research Paper</h2>
//       <p>
//         Explore our research paper on lumbar spinal stenosis detection:
//         Here, you can access papers that detail our approach to detecting spinal stenosis and classify its severity, 
//         the datasets we use, and the clinical implications of early diagnosis.
//       </p>
//       <button>Click here</button>
//       <p><strong>Research paper:</strong> Deep Learning for Detection and Severity Classification of Lumbar Spinal Stenosis in MRI Scans</p>
//       <p><strong>Dataset:</strong> RSNA 2024 Lumbar Spine Degenerative Classification</p>
//     </section>
//   );
// };

// export default Research;

import React from 'react';

const Research = () => {
  return (
    <section id="papers" style={styles.section}>
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
    </section>
  );
};

const styles = {
  section: {
    padding: '50px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    margin: '20px'
  },
  button: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#003366',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px'
  }
};

export default Research;
