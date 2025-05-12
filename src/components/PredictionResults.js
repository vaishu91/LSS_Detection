import React from 'react';

const PredictionResults = ({ results }) => {
  if (!results) return null;

  return (
    <div>
      <h3 style={{ color: 'white' }}>Prediction Results:</h3>
      {Object.entries(results).map(([modelName, data]) => (
        <div key={modelName} style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#00bcd4' }}>{modelName}</h4>
          <table style={{ width: '100%', color: 'white', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.th}>Class</th>
                <th style={styles.th}>Probability</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.Probabilities).map(([label, prob]) => (
                <tr key={label}>
                  <td style={styles.td}>{label}</td>
                  <td style={styles.td}>{(prob * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const styles = {
  th: {
    borderBottom: '1px solid white',
    padding: '8px',
    textAlign: 'left',
  },
  td: {
    padding: '8px',
  },
};

export default PredictionResults;
