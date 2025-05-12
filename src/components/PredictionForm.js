import React, { useState } from 'react';
import axios from 'axios';
const PredictForm = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a DICOM file first.");
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
      console.log("Prediction result:", response.data);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>DICOM Spinal Stenosis Prediction</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".dcm" onChange={handleFileChange} />
        <button type="submit">Predict</button>
      </form>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PredictForm;
