import React, { useState } from "react";

const stenosisTypes = {
  "Sagittal T1": "Neural Foraminal Narrowing",
  "Axial T2": "Subarticular Stenosis",
  "Sagittal T2/STIR": "Spinal Canal Stenosis",
};

const getPriorityClass = (probabilities) => {
  const severeProb = probabilities["Severe"] || 0;
  const moderateProb = probabilities["Moderate"] || 0;
  const normalProb = probabilities["Normal/Mild"] || 0;

  if (severeProb > 0.5) return "Severe";
  if (moderateProb > 0.3) return "Moderate";
  return "Normal/Mild";
};

const getHighlightedModelName = (modelResults) => {
  const priorityOrder = { Severe: 3, Moderate: 2, "Normal/Mild": 1 };
  let highest = null;
  let highestPriority = 0;
  for (const res of modelResults) {
    const priority = priorityOrder[res.className] || 0;
    if (priority > highestPriority) {
      highestPriority = priority;
      highest = res.modelName;
    } else if (priority === highestPriority) {
      const currentHighest = modelResults.find(m => m.modelName === highest);
      if (res.probability > (currentHighest?.probability || 0)) {
        highest = res.modelName;
      }
    }
  }
  return highest;
};

const PredictionResults = ({ results }) => {
  const [expandedModels, setExpandedModels] = useState({});
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  if (!results) return null;

  const modelMaxResults = [];
  const highlightClassByModel = {};

  for (const modelName in results) {
    const probabilities = results[modelName].Probabilities;
    const highlightClass = getPriorityClass(probabilities);
    highlightClassByModel[modelName] = highlightClass;

    modelMaxResults.push({
      modelName,
      className: highlightClass,
      probability: probabilities[highlightClass],
      stenosisType: stenosisTypes[modelName] || "Unknown",
    });
  }

  const highlightedModelName = getHighlightedModelName(modelMaxResults);
  const finalPrediction = modelMaxResults.find(
    (res) => res.modelName === highlightedModelName
  );

  const toggleModelDetails = (modelName) => {
    setExpandedModels((prev) => ({
      ...prev,
      [modelName]: !prev[modelName],
    }));
  };

  return (
    <div style={styles.container}>
      {/* Final Diagnosis at the top */}
      <div style={styles.finalBox}>
        <h2 style={styles.finalTitle}>Final Diagnosis</h2>
        <p style={styles.finalText}>
          <strong>{finalPrediction.stenosisType}</strong> predicted as{" "}
          <span style={styles.severityHighlight[finalPrediction.className]}>
            <strong>{finalPrediction.className}</strong>
          </span>
        </p>
        <div
          style={{
            marginTop: "10px",
            backgroundColor: "#1e1e1e",
            padding: "10px",
            borderRadius: "6px",             
            cursor: "pointer",
            border: "1px solid #00bcd4",
           }}
           onClick={() => setShowDetailedResults(!showDetailedResults)}
         >
           <strong style={{ color: "#00bcd4" }}>
            {showDetailedResults ? "Hide Detailed Description ▲" : "View Detailed Description ▼"}
           </strong>
         </div>
      </div>
      
      {/* Prediction Summary shown only when toggled */}
      {showDetailedResults && (
        <>
          <h3 style={styles.sectionTitle}>Max Predictions by Models</h3>
          <div style={styles.summaryContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Model</th>
                  <th style={styles.th}>Stenosis Type</th>
                  <th style={styles.th}>Severity Level</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {modelMaxResults.map((res) => {
                  const probs = results[res.modelName].Probabilities;
                  return (
                    <React.Fragment key={res.modelName}>
                      <tr
                        style={
                          res.modelName === highlightedModelName
                            ? styles.highlightRowStyles[res.className] || {}
                            : {}
                        }
                      >
                        <td style={styles.td}>{res.modelName}</td>
                        <td style={styles.td}>{res.stenosisType}</td>
                        <td style={styles.td}>{res.className}</td>
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#00bcd4",
                              fontWeight: "bold",
                              userSelect: "none",
                            }}
                            onClick={() => toggleModelDetails(res.modelName)}
                          >
                            {expandedModels[res.modelName] ? "Hide ▲" : "View ▼"}
                          </span>
                        </td>
                      </tr>
                      {expandedModels[res.modelName] && (
                        <tr>
                          <td colSpan="5" style={{ padding: "15px 20px" }}>
                            <div style={styles.dropdownBox}>
                              <table style={styles.innerTable}>
                                <thead>
                                  <tr>
                                    <th style={styles.th}>Severity Level</th>
                                    <th style={{ ...styles.th, textAlign: "center" }}>
                                      Probability
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(probs).map(([label, prob]) => (
                                    <tr
                                      key={label}
                                      style={
                                        label ===
                                        highlightClassByModel[res.modelName]
                                          ? styles.highlightRowStyles[label]
                                          : {}
                                      }
                                    >
                                      <td style={styles.td}>{label}</td>
                                      <td style={{ ...styles.td, textAlign: "center" }}>
                                        {(prob * 100).toFixed(2)}%
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#121212",
    padding: "20px",
    borderRadius: "8px",
  },
  finalBox: {
    backgroundColor: "#263238",
    padding: "15px 20px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #00bcd4",
  },
  finalTitle: {
    color: "#00bcd4",
    marginBottom: "10px",
    fontSize: "1.4em",
  },
  finalText: {
    color: "white",
    fontSize: "1.1em",
  },
  severityHighlight: {
    Severe: { color: "#ff5252" },
    Moderate: { color: "#ffb300" },
    "Normal/Mild": { color: "#81c784" },
  },
  sectionTitle: {
    fontSize: "1.3em",
    marginBottom: "15px",
    marginTop: "20px",
    color: "white",
  },
  summaryContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "20px",
    borderRadius: "6px",
    marginBottom: "30px",
  },
  table: {
    width: "100%",
    color: "white",
    borderCollapse: "collapse",
    borderRadius: "4px",
    overflow: "hidden",
  },
  innerTable: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  th: {
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    padding: "10px 12px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    fontSize: "0.9em",
    fontWeight: "normal",
    color: "#ccc",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  highlightRowStyles: {
    Severe: {
      border: "2px solid rgba(221, 25, 11, 0.91)",
      backgroundColor: "rgba(185, 26, 21, 0.07)",
      color: "white",
      fontWeight: "bold",
    },
    Moderate: {
      border: "2px solid rgba(247, 247, 1, 0.92)",
      backgroundColor: "rgba(255, 217, 0, 0.07)",
      color: "white",
      fontWeight: "bold",
    },
    "Normal/Mild": {
      border: "2px solid rgb(5, 145, 89)",
      backgroundColor: "rgba(0, 132, 79, 0.07)",
      color: "white",
      fontWeight: "bold",
    },
  },
  dropdownBox: {
  backgroundColor: "#1e1e1e",
  border: "1px solid rgba(0, 188, 212, 0.3)",
  borderRadius: "8px",
  padding: "15px",
  marginTop: "10px",
  marginBottom: "10px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
},

};

export default PredictionResults;




// import React, { useState } from "react";

// const stenosisTypes = {
//   "Sagittal T1": "Neural Foraminal Narrowing",
//   "Axial T2": "Subarticular Stenosis",
//   "Sagittal T2/STIR": "Spinal Canal Stenosis",
// };

// const getPriorityClass = (probabilities) => {
//   const severeProb = probabilities["Severe"] || 0;
//   const moderateProb = probabilities["Moderate"] || 0;
//   const normalProb = probabilities["Normal/Mild"] || 0;

//   if (severeProb > 0.5) return "Severe";
//   if (moderateProb > 0.3) return "Moderate";
//   return "Normal/Mild";
// };

// const getHighlightedModelName = (modelResults) => {
//   // Assuming this function returns the modelName with the highest priority
//   // Based on severity priority: Severe > Moderate > Normal/Mild
//   const priorityOrder = { Severe: 3, Moderate: 2, "Normal/Mild": 1 };
//   let highest = null;
//   let highestPriority = 0;
//   for (const res of modelResults) {
//     const priority = priorityOrder[res.className] || 0;
//     if (priority > highestPriority) {
//       highestPriority = priority;
//       highest = res.modelName;
//     } else if (priority === highestPriority) {
//       // If same priority, choose the one with higher probability
//       const currentHighest = modelResults.find(m => m.modelName === highest);
//       if (res.probability > (currentHighest?.probability || 0)) {
//         highest = res.modelName;
//       }
//     }
//   }
//   return highest;
// };

// const PredictionResults = ({ results }) => {
//   const [showDetailedResults, setShowDetailedResults] = useState(false);
//   if (!results) return null;

//   const modelMaxResults = [];
//   const highlightClassByModel = {};

//   for (const modelName in results) {
//     const probabilities = results[modelName].Probabilities;
//     const highlightClass = getPriorityClass(probabilities);
//     highlightClassByModel[modelName] = highlightClass;

//     modelMaxResults.push({
//       modelName,
//       className: highlightClass,
//       probability: probabilities[highlightClass],
//       stenosisType: stenosisTypes[modelName] || "Unknown",
//     });
//   }
//   const highlightedModelName = getHighlightedModelName(modelMaxResults);

//   const finalPrediction = modelMaxResults.find(
//     (res) => res.modelName === highlightedModelName
//   );

//   return (
//     <div style={styles.container}>
//       {/* Final Diagnosis at the top */}
//       <div style={styles.finalBox}>
//         <h2 style={styles.finalTitle}>Final Diagnosis</h2>
//         <p style={styles.finalText}>
//           <strong>{finalPrediction.stenosisType}</strong> predicted as{" "}
//           <span style={styles.severityHighlight[finalPrediction.className]}>
//             <strong>{finalPrediction.className}</strong>
//           </span>
//         </p>

//         {/* Dropdown Button */}
//         <div
//           style={{
//             marginTop: "10px",
//             backgroundColor: "#1e1e1e",
//             padding: "10px",
//             borderRadius: "6px",
//             cursor: "pointer",
//             border: "1px solid #00bcd4",
//           }}
//           onClick={() => setShowDetailedResults(!showDetailedResults)}
//         >
//           <strong style={{ color: "#00bcd4" }}>
//             {showDetailedResults ? "Hide" : "View"} Detailed Description ▼
//           </strong>
//         </div>
//       </div>

//       <div
//         style={{
//           maxHeight: showDetailedResults ? 2000 : 0,
//           overflow: "hidden",
//           transition: "max-height 0.5s ease, opacity 0.5s ease",
//           opacity: showDetailedResults ? 1 : 0,
//           marginTop: showDetailedResults ? 20 : 0,
//           color: "white",
//         }}
//       >
//         <h3 style={styles.sectionTitle}>Detailed Results</h3>

//         {/* Max Probabilities Summary */}
//         <div style={styles.summaryContainer}>
//           <h3 style={styles.subSectionTitle}>Max Probabilities by Model</h3>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Model</th>
//                 <th style={styles.th}>Stenosis Type</th>
//                 <th style={styles.th}>Severity Level</th>
//                 <th style={{ ...styles.th, textAlign: "center" }}>Probability</th>
//               </tr>
//             </thead>
//             <tbody>
//               {modelMaxResults.map((res) => (
//                 <tr
//                   key={res.modelName}
//                   style={
//                     res.modelName === highlightedModelName
//                       ? styles.highlightRowStyles[res.className] || {}
//                       : {}
//                   }
//                 >
//                   <td style={styles.td}>{res.modelName}</td>
//                   <td style={styles.td}>{res.stenosisType}</td>
//                   <td style={styles.td}>{res.className}</td>
//                   <td style={{ ...styles.td, textAlign: "center" }}>
//                     {(res.probability * 100).toFixed(2)}%
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* All Probabilities */}
//         <div style={styles.detailedSection}>
//           <h3 style={styles.subSectionTitle}>All Model Probabilities</h3>
//           {Object.entries(results).map(([modelName, data]) => (
//             <div key={modelName} style={styles.modelContainer}>
//               <h4 style={styles.modelTitle}>{modelName}</h4>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Severity Level</th>
//                     <th style={{ ...styles.th, textAlign: "center" }}>Probability</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(data.Probabilities).map(([label, prob]) => (
//                     <tr
//                       key={label}
//                       style={
//                         label === highlightClassByModel[modelName]
//                           ? styles.highlightRowStyles[label]
//                           : {}
//                       }
//                     >
//                       <td style={styles.td}>{label}</td>
//                       <td style={{ ...styles.td, textAlign: "center" }}>
//                         {(prob * 100).toFixed(2)}%
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     fontFamily: "Arial, sans-serif",
//     backgroundColor: "#121212",
//     padding: "20px",
//     borderRadius: "8px",
//   },
//   finalBox: {
//     backgroundColor: "#263238",
//     padding: "15px 20px",
//     marginBottom: "20px",
//     borderRadius: "8px",
//     border: "1px solid #00bcd4",
//   },
//   finalTitle: {
//     color: "#00bcd4",
//     marginBottom: "10px",
//     fontSize: "1.4em",
//   },
//   finalText: {
//     color: "white",
//     fontSize: "1.1em",
//   },
//   severityHighlight: {
//     Severe: { color: "#ff5252" },
//     Moderate: { color: "#ffb300" },
//     "Normal/Mild": { color: "#81c784" },
//   },
//   sectionTitle: {
//     fontSize: "1.3em",
//     marginBottom: "15px",
//     marginTop: "20px",
//     color: "white",
//   },
//   subSectionTitle: {
//     color: "#00bcd4",
//     fontSize: "1.2em",
//     marginBottom: "15px",
//   },
//   summaryContainer: {
//     backgroundColor: "rgba(255, 255, 255, 0.05)",
//     padding: "20px",
//     borderRadius: "6px",
//     marginBottom: "30px",
//   },
//   detailedSection: {
//     marginTop: "30px",
//   },
//   modelContainer: {
//     marginBottom: "25px",
//     backgroundColor: "rgba(255, 255, 255, 0.08)",
//     padding: "15px",
//     borderRadius: "6px",
//   },
//   modelTitle: {
//     color: "#00bcd4",
//     marginTop: 0,
//     marginBottom: "15px",
//     borderBottom: "1px solid rgba(255,255,255,0.15)",
//     paddingBottom: "8px",
//   },
//   table: {
//     width: "100%",
//     color: "white",
//     borderCollapse: "collapse",
//     borderRadius: "4px",
//     overflow: "hidden",
//   },
//   th: {
//     borderBottom: "1px solid rgba(255,255,255,0.2)",
//     padding: "10px 12px",
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     fontSize: "0.9em",
//     fontWeight: "normal",
//     color: "#ccc",
//   },
//   td: {
//     padding: "10px 12px",
//     borderBottom: "1px solid rgba(255,255,255,0.05)",
//   },
//   softHighlight: {
//     fontWeight: "bold",
//     color: "#ffffff",
//   },
//   highlightRowStyles: {
//     Severe: {
//       border: "2px solid rgba(221, 25, 11, 0.91)",
//       backgroundColor: "rgba(185, 26, 21, 0.07)",
//       color: "white",
//       fontWeight: "bold",
//     },
//     Moderate: {
//       border: "2px solid rgba(247, 247, 1, 0.92)",
//       backgroundColor: "rgba(255, 217, 0, 0.07)",
//       color: "white",
//       fontWeight: "bold",
//     },
//     "Normal/Mild": {
//       border: "2px solid rgb(5, 145, 89)",
//       backgroundColor: "rgba(0, 132, 79, 0.07)",
//       color: "white",
//       fontWeight: "bold",
//     },
//   },
// };

// export default PredictionResults;
