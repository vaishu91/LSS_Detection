import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import DicomViewer from "./DicomViewer";
import SimpleDicomViewer from "./SimpleDicomViewer";
import PredictionResults from "./PredictionResults";

const Home = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [viewerError, setViewerError] = useState(false);
  const [isPredicted, setIsPredicted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (isPredicted && resultsRef.current) {
      const offset = 120; // Adjust this value based on your navbar height
      const elementTop = resultsRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop - offset, behavior: "smooth" });
    }
  }, [isPredicted]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setViewerError(false);
      setIsPredicted(false);
      setError(null);

      const isDicom =
        selectedFile.name.toLowerCase().endsWith(".dcm") ||
        selectedFile.type === "application/dicom";

      if (!isDicom) {
        console.warn("File might not be a DICOM file:", selectedFile.name, selectedFile.type);
        setError("Warning: File may not be a valid DICOM image. Results may be affected.");
      }
    }
  };

  const handleViewerError = () => {
    console.log("Main viewer failed, switching to fallback");
    setViewerError(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a DICOM (.dcm) file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setResult(response.data);
      setIsPredicted(true);
    } catch (error) {
      console.error("Prediction failed:", error);
      setError(
        `Prediction failed: ${
          error.response?.data?.detail || error.message || "Check backend or CORS settings"
        }`,
      );
      setIsPredicted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="home"
      style={{ ...styles.home, paddingTop: "150px", marginTop: "-100px" }}
    >
      <div style={styles.overlay}>
        <h1>Welcome,</h1>
        <p>
          We present you the solution for the early detection and management of
          lumbar spinal stenosis. Our innovative platform utilizes Deep Learning
          techniques to analyze MRI images and provide accurate assessments to
          help healthcare professionals make informed decisions.
        </p>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formContent}>
              <div style={styles.fileUploadContainer}>
                <label htmlFor="dicom-file" style={styles.fileLabel}>
                  Select DICOM file (.dcm)
                </label>
                <input
                  id="dicom-file"
                  type="file"
                  accept=".dcm"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                  disabled={isLoading}
                />
                {file && (
                  <div style={styles.fileName}>Selected: {file.name}</div>
                )}
                {error && <div style={styles.errorMessage}>{error}</div>}
              </div>

              <div style={styles.buttonContainer}>
                <button
                  type="submit"
                  style={{
                    ...styles.uploadBtn,
                    opacity: !file || isPredicted || isLoading ? 0.6 : 1,
                  }}
                  disabled={!file || isPredicted || isLoading}
                >
                  {isLoading ? (
                    <div style={styles.loaderContainer}>
                      <div style={styles.loader}></div>
                      <span style={styles.loaderText}>Predicting...</span>
                    </div>
                  ) : (
                    "Predict"
                  )}
                </button>

                {isPredicted && (
                  <button
                    type="button"
                    style={styles.resetButton}
                    onClick={() => {
                      setIsPredicted(false);
                      setResult(null);
                    }}
                  >
                    New Prediction
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {result && (
          <div style={styles.resultsContainer} ref={resultsRef}>
            <PredictionResults results={result} />
          </div>
        )}

        {file && (
          <div style={styles.previewContainer}>
            <h3 style={styles.previewTitle}>Image Metadata Preview:</h3>
            <div style={styles.imagePreviewWrapper}>
              {viewerError ? (
                <SimpleDicomViewer file={file} />
              ) : (
                <DicomViewer file={file} onError={handleViewerError} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  home: {
    backgroundImage: 'url("bg.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "70px",
    borderRadius: "10px",
    maxWidth: "800px",
    position: "relative",
    top: "-40px",
  },
  formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "30px",
  },
  formContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  fileUploadContainer: {
    width: "100%",
    textAlign: "left",
    marginBottom: "10px",
  },
  fileLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "15px",
    color: "#ddd",
    fontWeight: "bold",
  },
  fileInput: {
    padding: "12px",
    width: "80%",
    border: "1px solid #555",
    borderRadius: "4px",
    backgroundColor: "#333",
    color: "white",
    fontSize: "14px",
  },
  fileName: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#00bcd4",
    padding: "5px 0",
  },
  errorMessage: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "rgba(255,50,50,0.2)",
    color: "#ff6b6b",
    borderRadius: "4px",
    fontSize: "14px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "10px",
    width: "100%",
  },
  uploadBtn: {
    padding: "12px 25px",
    backgroundColor: "#00bcd4",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "all 0.3s ease",
    minWidth: "150px",
  },
  resetButton: {
    padding: "12px 25px",
    backgroundColor: "transparent",
    border: "1px solid #00bcd4",
    borderRadius: "5px",
    color: "#00bcd4",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "all 0.3s ease",
    minWidth: "150px",
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  loader: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "white",
    animation: "spin 1s linear infinite",
  },
  loaderText: {
    fontSize: "14px",
  },
  resultsContainer: {
    marginTop: "40px",
    backgroundColor: "#222",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  previewContainer: {
    marginTop: "40px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "25px",
    borderRadius: "10px",
  },
  previewTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#00bcd4",
    textAlign: "left",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "10px",
  },
  imagePreviewWrapper: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "5px",
    padding: "15px",
  },
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Home;


// import React, { useState } from "react";
// import axios from "axios";
// import DicomViewer from "./DicomViewer";
// import SimpleDicomViewer from "./SimpleDicomViewer";
// import PredictionResults from "./PredictionResults";

// const Home = () => {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [viewerError, setViewerError] = useState(false);
//   const [isPredicted, setIsPredicted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];

//     if (selectedFile) {
//       // Reset states
//       setFile(selectedFile);
//       setResult(null);
//       setViewerError(false);
//       setIsPredicted(false);
//       setError(null);

//       // Log warning if file doesn't appear to be DICOM
//       const isDicom =
//         selectedFile.name.toLowerCase().endsWith(".dcm") ||
//         selectedFile.type === "application/dicom";

//       if (!isDicom) {
//         console.warn(
//           "File might not be a DICOM file:",
//           selectedFile.name,
//           selectedFile.type,
//         );
//         setError(
//           "Warning: File may not be a valid DICOM image. Results may be affected.",
//         );
//       }
//     }
//   };

//   const handleViewerError = () => {
//     console.log("Main viewer failed, switching to fallback");
//     setViewerError(true);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!file) {
//       alert("Please upload a DICOM (.dcm) file.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/predict",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );
//       setResult(response.data);
//       setIsPredicted(true);
//     } catch (error) {
//       console.error("Prediction failed:", error);
//       setError(
//         `Prediction failed: ${
//           error.response?.data?.detail ||
//           error.message ||
//           "Check backend or CORS settings"
//         }`,
//       );
//       setIsPredicted(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <section
//       id="home"
//       style={{ ...styles.home, paddingTop: "150px", marginTop: "-100px" }}
//     >
//       <div style={styles.overlay}>
//         <h1>Welcome,</h1>
//         <p>
//           We present you the solution for the early detection and management of
//           lumbar spinal stenosis. Our innovative platform utilizes Deep Learning
//           techniques to analyze MRI images and provide accurate assessments to
//           help healthcare professionals make informed decisions.
//         </p>

//         <div style={styles.formContainer}>
//           <form onSubmit={handleSubmit}>
//             <div style={styles.formContent}>
//               <div style={styles.fileUploadContainer}>
//                 <label htmlFor="dicom-file" style={styles.fileLabel}>
//                   Select DICOM file (.dcm)
//                 </label>
//                 <input
//                   id="dicom-file"
//                   type="file"
//                   accept=".dcm"
//                   onChange={handleFileChange}
//                   style={styles.fileInput}
//                   disabled={isLoading}
//                 />
//                 {file && (
//                   <div style={styles.fileName}>Selected: {file.name}</div>
//                 )}
//                 {error && <div style={styles.errorMessage}>{error}</div>}
//               </div>

//               <div style={styles.buttonContainer}>
//                 <button
//                   type="submit"
//                   style={{
//                     ...styles.uploadBtn,
//                     opacity: !file || isPredicted || isLoading ? 0.6 : 1,
//                   }}
//                   disabled={!file || isPredicted || isLoading}
//                 >
//                   {isLoading ? (
//                     <div style={styles.loaderContainer}>
//                       <div style={styles.loader}></div>
//                       <span style={styles.loaderText}>Predicting...</span>
//                     </div>
//                   ) : (
//                     "Predict"
//                   )}
//                 </button>

//                 {isPredicted && (
//                   <button
//                     type="button"
//                     style={styles.resetButton}
//                     onClick={() => {
//                       setIsPredicted(false);
//                       setResult(null);
//                     }}
//                   >
//                     New Prediction
//                   </button>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>

//         {result && (
//           <div style={styles.resultsContainer}>
//             <PredictionResults results={result} />
//           </div>
//         )}

//         {file && (
//           <div style={styles.previewContainer}>
//             <h3 style={styles.previewTitle}>Image Preview:</h3>
//             <div style={styles.imagePreviewWrapper}>
//               {viewerError ? (
//                 <SimpleDicomViewer file={file} />
//               ) : (
//                 <DicomViewer file={file} onError={handleViewerError} />
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// const styles = {
//   home: {
//     backgroundImage: 'url("bg.jpg")',
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     color: "white",
//     minHeight: "80vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     position: "relative",
//   },
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     padding: "70px",
//     borderRadius: "10px",
//     maxWidth: "800px",
//     position: "relative",
//     top: "-40px",
//   },
//   formContainer: {
//     backgroundColor: "rgba(0, 0, 0, 0.2)",
//     padding: "20px",
//     borderRadius: "8px",
//     marginTop: "30px",
//   },
//   formContent: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "20px",
//   },
//   fileUploadContainer: {
//     width: "100%",
//     textAlign: "left",
//     marginBottom: "10px",
//   },
//   fileLabel: {
//     display: "block",
//     marginBottom: "8px",
//     fontSize: "15px",
//     color: "#ddd",
//     fontWeight: "bold",
//   },
//   fileInput: {
//     padding: "12px",
//     width: "80%",
//     border: "1px solid #555",
//     borderRadius: "4px",
//     backgroundColor: "#333",
//     color: "white",
//     fontSize: "14px",
//   },
//   fileName: {
//     marginTop: "8px",
//     fontSize: "14px",
//     color: "#00bcd4",
//     padding: "5px 0",
//   },
//   errorMessage: {
//     marginTop: "10px",
//     padding: "8px 12px",
//     backgroundColor: "rgba(255,50,50,0.2)",
//     color: "#ff6b6b",
//     borderRadius: "4px",
//     fontSize: "14px",
//   },
//   buttonContainer: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "15px",
//     marginTop: "10px",
//     width: "100%",
//   },
//   uploadBtn: {
//     padding: "12px 25px",
//     backgroundColor: "#00bcd4",
//     border: "none",
//     borderRadius: "5px",
//     color: "white",
//     cursor: "pointer",
//     fontWeight: "bold",
//     fontSize: "15px",
//     transition: "all 0.3s ease",
//     minWidth: "150px",
//   },
//   resetButton: {
//     padding: "12px 25px",
//     backgroundColor: "transparent",
//     border: "1px solid #00bcd4",
//     borderRadius: "5px",
//     color: "#00bcd4",
//     cursor: "pointer",
//     fontWeight: "bold",
//     fontSize: "15px",
//     transition: "all 0.3s ease",
//     minWidth: "150px",
//   },
//   loaderContainer: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "10px",
//   },
//   loader: {
//     width: "18px",
//     height: "18px",
//     border: "3px solid rgba(255, 255, 255, 0.3)",
//     borderRadius: "50%",
//     borderTopColor: "white",
//     animation: "spin 1s linear infinite",
//   },
//   loaderText: {
//     fontSize: "14px",
//   },
//   resultsContainer: {
//     marginTop: "40px",
//     backgroundColor: "#222",
//     padding: "25px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//   },
//   previewContainer: {
//     marginTop: "40px",
//     backgroundColor: "rgba(0, 0, 0, 0.2)",
//     padding: "25px",
//     borderRadius: "10px",
//   },
//   previewTitle: {
//     marginTop: 0,
//     marginBottom: "20px",
//     color: "#00bcd4",
//     textAlign: "left",
//     borderBottom: "1px solid rgba(255,255,255,0.1)",
//     paddingBottom: "10px",
//   },
//   imagePreviewWrapper: {
//     backgroundColor: "rgba(0,0,0,0.2)",
//     borderRadius: "5px",
//     padding: "15px",
//   },
// };

// // Add the keyframe animation for the loader spin
// const styleSheet = document.createElement("style");
// styleSheet.innerText = `
//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default Home;
