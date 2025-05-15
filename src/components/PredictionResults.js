import React, { useState } from "react";

const PredictionResults = ({ results }) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  if (!results) return null;

  // Calculate sums and averages for each class
  const classSums = {};
  const classCounts = {};

  // Process all results
  for (const category in results) {
    const data = results[category];
    Object.entries(data.Probabilities).forEach(([label, prob]) => {
      classSums[label] = (classSums[label] || 0) + prob;
      classCounts[label] = (classCounts[label] || 0) + 1;
    });
  }

  // Calculate averages
  const classAverages = {};
  Object.keys(classSums).forEach((className) => {
    classAverages[className] = classSums[className] / classCounts[className];
  });

  // Find class with highest average
  let highestClass = "";
  let highestAverage = -1;
  Object.entries(classAverages).forEach(([className, average]) => {
    if (average > highestAverage) {
      highestAverage = average;
      highestClass = className;
    }
  });

  return (
    <div style={styles.container}>
      <div
        style={{
          backgroundColor: "#00bcd4",
          color: "black",
          padding: "15px",
          borderRadius: "5px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: showDetailedResults
            ? "0 4px 8px rgba(0,0,0,0.2)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          transform: showDetailedResults ? "scale(1.02)" : "scale(1)",
        }}
        onClick={() => setShowDetailedResults(!showDetailedResults)}
      >
        Prediction: <span style={{ fontSize: "1.2em" }}>{highestClass}</span> (
        {(highestAverage * 100).toFixed(2)}%)
        <span
          style={{
            float: "right",
            transition: "transform 0.3s ease",
            transform: showDetailedResults ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </div>

      <div
        style={{
          maxHeight: showDetailedResults ? "2000px" : "0",
          overflow: "hidden",
          transition: "all 0.5s ease",
          opacity: showDetailedResults ? 1 : 0,
          marginTop: showDetailedResults ? "20px" : "0",
        }}
      >
        <h3 style={styles.sectionTitle}>Detailed Results</h3>

        {/* Summary results */}
        <div style={styles.summaryContainer}>
          <h3 style={styles.subSectionTitle}>Summary</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, textAlign: "center" }}>Class</th>
                <th style={{ ...styles.th, textAlign: "center" }}>
                  Probability
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(classAverages).map((className) => (
                <tr
                  key={className}
                  style={className === highestClass ? styles.highlighted : {}}
                >
                  <td style={styles.td}>{className}</td>
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      fontWeight:
                        className === highestClass ? "bold" : "normal",
                    }}
                  >
                    {(classAverages[className] * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.detailedSection}>
          <h3 style={styles.subSectionTitle}>Model Results</h3>

          {/* Individual model results */}
          {Object.entries(results).map(([modelName, data]) => (
            <div key={modelName} style={styles.modelContainer}>
              <h4 style={styles.modelTitle}>{modelName}</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th
                      style={{
                        ...styles.th,
                        textAlign: "center",
                      }}
                    >
                      Class
                    </th>
                    <th
                      style={{
                        ...styles.th,
                        textAlign: "center",
                      }}
                    >
                      Probability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.Probabilities).map(([label, prob]) => (
                    <tr
                      key={label}
                      style={label === highestClass ? styles.softHighlight : {}}
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
  },
  sectionTitle: {
    color: "white",
    fontSize: "1.3em",
    marginBottom: "15px",
    marginTop: "20px",
  },
  subSectionTitle: {
    color: "#00bcd4",
    fontSize: "1.2em",
    marginBottom: "15px",
  },
  summaryContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "30px",
  },
  detailedSection: {
    marginTop: "30px",
  },
  modelContainer: {
    marginBottom: "25px",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    padding: "15px",
    borderRadius: "5px",
  },
  modelTitle: {
    color: "#00bcd4",
    marginTop: "0",
    marginBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
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
    textAlign: "left",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    fontSize: "0.9em",
    fontWeight: "normal",
    color: "#ccc",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  highlighted: {
    backgroundColor: "rgba(0, 188, 212, 0.2)",
    fontWeight: "bold",
  },
  softHighlight: {
    backgroundColor: "rgba(0, 188, 212, 0.05)",
  },
};

export default PredictionResults;
