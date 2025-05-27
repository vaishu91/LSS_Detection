import React, { useState } from "react";

const stenosisTypes = {
  "Sagittal T1": "Spinal Canal Stenosis",
  "Axial T2": "Subarticular Stenosis",
  "Sagittal T2/STIR": "Neural Foraminal Narrowing",
};

const PredictionResults = ({ results }) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  if (!results) return null;

  const modelMaxResults = [];
  const topClassByModel = {}; // <--- store top class for each model

  // Step 1: For each model, find the class with highest probability
  for (const modelName in results) {
    const probabilities = results[modelName].Probabilities;
    let maxProb = -1;
    let maxClass = "";

    for (const [label, prob] of Object.entries(probabilities)) {
      if (prob > maxProb) {
        maxProb = prob;
        maxClass = label;
      }
    }

    topClassByModel[modelName] = maxClass; // store per-model top class

    modelMaxResults.push({
      modelName,
      className: maxClass,
      probability: maxProb,
      stenosisType: stenosisTypes[modelName] || "Unknown",
    });
  }

  // Step 2: Determine final prediction - the one with highest probability among all models
  let finalPrediction = modelMaxResults[0];
  for (const result of modelMaxResults) {
    if (result.probability > finalPrediction.probability) {
      finalPrediction = result;
    }
  }

  return (
    <div style={styles.container}>
      {/* Top summary bar with all models and their max predictions */}
      <div
        style={{
          ...styles.topBar,
          boxShadow: showDetailedResults
            ? "0 4px 8px rgba(0,0,0,0.3)"
            : "0 2px 4px rgba(0,0,0,0.15)",
        }}
        onClick={() => setShowDetailedResults(!showDetailedResults)}
        title="Click to toggle detailed results"
      >
        <table style={{ width: "100%", color: "white", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={styles.thTopBar}>Stenosis Type</th>
              <th style={{ ...styles.thTopBar, textAlign: "center" }}>Severity Level</th>
            </tr>
          </thead>
          <tbody>
            {modelMaxResults.map(({ modelName, className, probability, stenosisType }) => (
              <tr>
                <td style={styles.tdTopBar}>{stenosisType}</td>
                <td style={{ ...styles.tdTopBar, textAlign: "center" }}>{className}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            marginLeft: "auto",
            paddingLeft: 10,
            fontWeight: "bold",
            fontSize: "1.2em",
            userSelect: "none",
            transform: showDetailedResults ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            cursor: "pointer",
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
          aria-label={showDetailedResults ? "Collapse details" : "Expand details"}
        >
          ▼
        </div>
      </div>

      {/* Detailed results section */}
      <div
        style={{
          maxHeight: showDetailedResults ? 2000 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease, opacity 0.5s ease",
          opacity: showDetailedResults ? 1 : 0,
          marginTop: showDetailedResults ? 20 : 0,
          color: "white",
        }}
      >
        <h3 style={styles.sectionTitle}>Detailed Results</h3>

        {/* Summary of max results */}
        <div style={styles.summaryContainer}>
          <h3 style={styles.subSectionTitle}>Max Probabilities by Model</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Model</th>
                <th style={styles.th}>Stenosis Type</th>
                <th style={styles.th}>Severity Level</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Probability</th>
              </tr>
            </thead>
            <tbody>
              {modelMaxResults.map((res, index) => (
                <tr>
                  <td style={styles.td}>{res.modelName}</td>
                  <td style={styles.td}>{res.stenosisType}</td>
                  <td style={styles.td}>{res.className}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {(res.probability * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Full breakdown for each model */}
        <div style={styles.detailedSection}>
          <h3 style={styles.subSectionTitle}>All Model Probabilities</h3>
          {Object.entries(results).map(([modelName, data]) => (
            <div key={modelName} style={styles.modelContainer}>
              <h4 style={styles.modelTitle}>{modelName}</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Severity Level</th>
                    <th style={{ ...styles.th, textAlign: "center" }}>Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.Probabilities).map(([label, prob]) => (
                    <tr
                      key={label}
                      style={
                        label === topClassByModel[modelName]
                          ? styles.softHighlight
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
          ))}
        </div>
      </div>
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
  topBar: {
    backgroundColor: "#00bcd4",
    color: "black",
    padding: "15px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  thTopBar: {
    padding: "8px",
    color: "black",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
  },
  tdTopBar: {
    padding: "8px",
    color: "black",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },
  sectionTitle: {
    fontSize: "1.3em",
    marginBottom: "15px",
    marginTop: "20px",
    color: "white",
  },
  subSectionTitle: {
    color: "#00bcd4",
    fontSize: "1.2em",
    marginBottom: "15px",
  },
  summaryContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "20px",
    borderRadius: "6px",
    marginBottom: "30px",
  },
  detailedSection: {
    marginTop: "30px",
  },
  modelContainer: {
    marginBottom: "25px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: "15px",
    borderRadius: "6px",
  },
  modelTitle: {
    color: "#00bcd4",
    marginTop: 0,
    marginBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    paddingBottom: "8px",
  },
  table: {
    width: "100%",
    color: "white",
    borderCollapse: "collapse",
    borderRadius: "4px",
    overflow: "hidden",
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
  softHighlight: {
    backgroundColor: "rgba(0, 188, 212, 0.25)",
    fontWeight: "bold",
    color: "#00e5ff",
  },
};

export default PredictionResults;



// import React, { useState } from "react";

// const PredictionResults = ({ results }) => {
//   const [showDetailedResults, setShowDetailedResults] = useState(false);
//   if (!results) return null;

//   // Calculate sums and averages for each class
//   const classSums = {};
//   const classCounts = {};

//   // Process all results
//   for (const category in results) {
//     const data = results[category];
//     Object.entries(data.Probabilities).forEach(([label, prob]) => {
//       classSums[label] = (classSums[label] || 0) + prob;
//       classCounts[label] = (classCounts[label] || 0) + 1;
//     });
//   }

//   // Calculate averages
//   const classAverages = {};
//   Object.keys(classSums).forEach((className) => {
//     classAverages[className] = classSums[className] / classCounts[className];
//   });

//   // Find class with highest average
//   let highestClass = "";
//   let highestAverage = -1;
//   Object.entries(classAverages).forEach(([className, average]) => {
//     if (average > highestAverage) {
//       highestAverage = average;
//       highestClass = className;
//     }
//   });

//   return (
//     <div style={styles.container}>
//       <div
//         style={{
//           backgroundColor: "#00bcd4",
//           color: "black",
//           padding: "15px",
//           borderRadius: "5px",
//           fontWeight: "bold",
//           cursor: "pointer",
//           transition: "all 0.3s ease",
//           boxShadow: showDetailedResults
//             ? "0 4px 8px rgba(0,0,0,0.2)"
//             : "0 2px 4px rgba(0,0,0,0.1)",
//           transform: showDetailedResults ? "scale(1.02)" : "scale(1)",
//         }}
//         onClick={() => setShowDetailedResults(!showDetailedResults)}
//       >
//         Prediction: <span style={{ fontSize: "1.2em" }}>{highestClass}</span> (
//         {(highestAverage * 100).toFixed(2)}%)
//         <span
//           style={{
//             float: "right",
//             transition: "transform 0.3s ease",
//             transform: showDetailedResults ? "rotate(180deg)" : "rotate(0deg)",
//           }}
//         >
//           ▼
//         </span>
//       </div>

//       <div
//         style={{
//           maxHeight: showDetailedResults ? "2000px" : "0",
//           overflow: "hidden",
//           transition: "all 0.5s ease",
//           opacity: showDetailedResults ? 1 : 0,
//           marginTop: showDetailedResults ? "20px" : "0",
//         }}
//       >
//         <h3 style={styles.sectionTitle}>Detailed Results</h3>

//         {/* Summary results */}
//         <div style={styles.summaryContainer}>
//           <h3 style={styles.subSectionTitle}>Summary</h3>

//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={{ ...styles.th, textAlign: "center" }}>Class</th>
//                 <th style={{ ...styles.th, textAlign: "center" }}>
//                   Probability
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.keys(classAverages).map((className) => (
//                 <tr
//                   key={className}
//                   style={className === highestClass ? styles.highlighted : {}}
//                 >
//                   <td style={styles.td}>{className}</td>
//                   <td
//                     style={{
//                       ...styles.td,
//                       textAlign: "center",
//                       fontWeight:
//                         className === highestClass ? "bold" : "normal",
//                     }}
//                   >
//                     {(classAverages[className] * 100).toFixed(2)}%
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div style={styles.detailedSection}>
//           <h3 style={styles.subSectionTitle}>Model Results</h3>

//           {/* Individual model results */}
//           {Object.entries(results).map(([modelName, data]) => (
//             <div key={modelName} style={styles.modelContainer}>
//               <h4 style={styles.modelTitle}>{modelName}</h4>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th
//                       style={{
//                         ...styles.th,
//                         textAlign: "center",
//                       }}
//                     >
//                       Class
//                     </th>
//                     <th
//                       style={{
//                         ...styles.th,
//                         textAlign: "center",
//                       }}
//                     >
//                       Probability
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(data.Probabilities).map(([label, prob]) => (
//                     <tr
//                       key={label}
//                       style={label === highestClass ? styles.softHighlight : {}}
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
//   },
//   sectionTitle: {
//     color: "white",
//     fontSize: "1.3em",
//     marginBottom: "15px",
//     marginTop: "20px",
//   },
//   subSectionTitle: {
//     color: "#00bcd4",
//     fontSize: "1.2em",
//     marginBottom: "15px",
//   },
//   summaryContainer: {
//     backgroundColor: "rgba(0, 0, 0, 0.2)",
//     padding: "20px",
//     borderRadius: "5px",
//     marginBottom: "30px",
//   },
//   detailedSection: {
//     marginTop: "30px",
//   },
//   modelContainer: {
//     marginBottom: "25px",
//     backgroundColor: "rgba(0, 0, 0, 0.15)",
//     padding: "15px",
//     borderRadius: "5px",
//   },
//   modelTitle: {
//     color: "#00bcd4",
//     marginTop: "0",
//     marginBottom: "15px",
//     borderBottom: "1px solid rgba(255,255,255,0.1)",
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
//     textAlign: "left",
//     backgroundColor: "rgba(0, 0, 0, 0.2)",
//     fontSize: "0.9em",
//     fontWeight: "normal",
//     color: "#ccc",
//   },
//   td: {
//     padding: "10px 12px",
//     borderBottom: "1px solid rgba(255,255,255,0.05)",
//   },
//   highlighted: {
//     backgroundColor: "rgba(0, 188, 212, 0.2)",
//     fontWeight: "bold",
//   },
//   softHighlight: {
//     backgroundColor: "rgba(0, 188, 212, 0.05)",
//   },
// };

// export default PredictionResults;
