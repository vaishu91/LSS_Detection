import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DicomViewer from './DicomViewer';
import PredictionResults from './PredictionResults.js';

const Home = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null); // Ref to the result section

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null); // reset result on new file upload
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a DICOM (.dcm) file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Prediction failed. Check backend or CORS settings.");
    }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  return (
    <section id="home" style={{ ...styles.home, paddingTop: '150px', marginTop: '-100px' }}>
      <div style={styles.overlay}>
        <h1>Welcome,</h1>
        <p>
          We present you the solution for the early detection and management of lumbar spinal stenosis. 
          Our innovative platform utilizes Deep Learning techniques to analyze the MRI images and provide 
          accurate assessments, helping healthcare professionals to make informed decisions.
        </p>

        <form onSubmit={handleSubmit} style={styles.formGroup}>
          <input
            id="file-upload"
            type="file"
            accept=".dcm"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" style={styles.customFileBox}>
            {file ? file.name : "Click to choose .dcm file"}
          </label>
          <button type="submit" style={styles.uploadBtn}>Predict</button>
        </form>

        {file && (
          <div style={{ marginTop: '30px' }}>
            <h3>Image Preview:</h3>
            <DicomViewer file={file} />
          </div>
        )}

        {result && (
          <div
            ref={resultRef}
            id="result"
            style={{ marginTop: '30px', backgroundColor: '#222', padding: '20px', borderRadius: '10px', scrollMarginTop: '100px'}}
          >
            <PredictionResults results={result} />
          </div>
        )}
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
  },

  formGroup: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },

  customFileBox: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    color: '#333',
    cursor: 'pointer',
    minWidth: '220px',
    maxWidth: '300px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: '500',
  },

  uploadBtn: {
    padding: '10px 20px',
    backgroundColor: '#00cccc',
    border: 'none',
    borderRadius: '5px',
    color: '#000',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Home;
