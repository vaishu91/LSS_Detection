import React, { useState, useEffect } from "react";
import dicomParser from "dicom-parser";

const SimpleDicomViewer = ({ file }) => {
  const [error, setError] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      try {
        const arrayBuffer = e.target.result;
        const byteArray = new Uint8Array(arrayBuffer);

        try {
          // Try to parse the DICOM data
          const dataSet = dicomParser.parseDicom(byteArray);

          // Get some basic information
          const info = {
            patientName: dataSet.string("x00100010") || "Unknown",
            patientId: dataSet.string("x00100020") || "Unknown",
            studyDate: dataSet.string("x00080020") || "Unknown",
            modality: dataSet.string("x00080060") || "Unknown",
            rows: dataSet.uint16("x00280010") || 0,
            columns: dataSet.uint16("x00280011") || 0,
          };

          setImageInfo(info);
        } catch (parseError) {
          console.error("Error parsing DICOM file:", parseError);
          setError(`Cannot parse DICOM: ${parseError.message}`);
        }
      } catch (err) {
        console.error("Error reading file:", err);
        setError(`Error reading file: ${err.message}`);
      }
    };

    fileReader.onerror = function () {
      setError("Failed to read the file");
    };

    // Read file as array buffer for DICOM parsing
    fileReader.readAsArrayBuffer(file);
  }, [file]);

  if (error) {
    return (
      <div
        style={{
          color: "red",
          padding: "10px",
          backgroundColor: "rgba(255,0,0,0.1)",
          borderRadius: "5px",
        }}
      >
        {error}
      </div>
    );
  }

  if (!imageInfo) {
    return <div>Loading DICOM information...</div>;
  }

  return (
    <div
      style={{
        textAlign: "left",
        backgroundColor: "rgba(0,0,0,0.3)",
        padding: "15px",
        borderRadius: "5px",
      }}
    >
      <h3>DICOM Information:</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: "5px",
        }}
      >
        <div>Patient Name:</div>
        <div>{imageInfo.patientName}</div>

        <div>Patient ID:</div>
        <div>{imageInfo.patientId}</div>

        <div>Study Date:</div>
        <div>{imageInfo.studyDate}</div>

        <div>Modality:</div>
        <div>{imageInfo.modality}</div>

        <div>Image Size:</div>
        <div>
          {imageInfo.columns} x {imageInfo.rows} pixels
        </div>
      </div>

      <div style={{ marginTop: "15px", fontStyle: "italic", fontSize: "14px" }}>
        Note: Full image preview is not available, only DICOM metadata is shown.
      </div>
    </div>
  );
};

export default SimpleDicomViewer;
