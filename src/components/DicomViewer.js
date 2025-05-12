import React, { useEffect, useRef } from 'react';
import { App } from 'dwv'; // DWV DICOM Viewer
//import 'dwv/dist/dwv.css'; // Optional: Add DWV styles

const DicomViewer = ({ file }) => {
  const viewerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (file && viewerRef.current) {
      const app = new App();
      appRef.current = app;

      app.init({
        containerDivId: viewerRef.current.id,
        tools: ['Scroll', 'WindowLevel', 'ZoomAndPan', 'Draw'],
        isMobile: false
      });

      // Read the file as a Blob URL
      const fileUrl = URL.createObjectURL(file);
      app.loadURLs([fileUrl]);

      // Clean up blob URL on unmount
      return () => {
        URL.revokeObjectURL(fileUrl);
      };
    }
  }, [file]);

  return (
    <div
      id="dwv-container"
      ref={viewerRef}
      style={{
        width: '100%',
        height: '512px',
        backgroundColor: '#000'
      }}
    />
  );
};

export default DicomViewer;
