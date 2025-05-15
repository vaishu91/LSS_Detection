import React, { useEffect, useRef, useState } from "react";
import { App } from "dwv";
import "../styles/DicomViewer.css"; // Your custom CSS (not DWV's, as DWV may not have it in NPM build)

const DicomViewer = ({ file, onError }) => {
  const viewerRef = useRef(null);
  const [jpegUrl, setJpegUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file || !viewerRef.current) {
      console.log("No file or viewer ref available");
      return;
    }

    console.log("Loading file:", file.name, "Type:", file.type);

    try {
      const app = new App();

      // Initialize with minimal configuration
      app.init({
        containerDivId: viewerRef.current.id,
        viewOnFirstLoadItem: true,
      });

      // Create URL and load
      const fileUrl = URL.createObjectURL(file);
      console.log("Created object URL:", fileUrl);

      // Add load event handler before loading URLs
      app.addEventListener("load", () => {
        console.log("DWV load event fired");
        try {
          setTimeout(() => {
            const canvas = viewerRef.current?.querySelector("canvas");
            if (canvas) {
              console.log("Canvas found, converting to JPEG");
              try {
                const jpegDataUrl = canvas.toDataURL("image/jpeg");
                setJpegUrl(jpegDataUrl);
              } catch (canvasErr) {
                console.error("Canvas conversion error:", canvasErr);
                setError("Failed to convert image to JPEG");
                onError && onError("canvas-conversion");
              }
            } else {
              console.warn("No canvas found in viewer container");
              setError("Failed to render image - no canvas found");
              onError && onError("no-canvas");
            }
          }, 1000); // Increased timeout to ensure rendering completes
        } catch (eventErr) {
          console.error("Error in load event handler:", eventErr);
          setError("Error processing image after load");
          onError && onError("load-event");
        }
      });

      // Add error handler
      app.addEventListener("error", (event) => {
        console.error("DWV error event:", event);
        setError(`DWV error: ${event.error?.message || "Unknown error"}`);
        onError && onError("dwv-error");
      });

      // Load the file
      try {
        app.loadURLs([fileUrl]);
        console.log("File URL loaded in DWV");
      } catch (loadErr) {
        console.error("Error loading URL in DWV:", loadErr);
        setError(`Failed to load image: ${loadErr.message}`);
        onError && onError("load-error");
      }

      return () => {
        URL.revokeObjectURL(fileUrl);
        try {
          app.reset();
        } catch (resetErr) {
          console.warn("Error during DWV reset:", resetErr);
        }
      };
    } catch (err) {
      console.error("Error initializing DWV app:", err);
      setError(`Failed to initialize viewer: ${err.message}`);
      onError && onError("init-error");
      return () => {};
    }
  }, [file, onError]);

  return (
    <div>
      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "8px",
            backgroundColor: "rgba(255,0,0,0.1)",
            borderRadius: "4px",
          }}
        >
          Error: {error}
        </div>
      )}

      <div
        id="dwv-container"
        ref={viewerRef}
        style={{ width: "100%", height: "400px", backgroundColor: "#000" }}
      />

      {jpegUrl ? (
        <div style={{ marginTop: "20px" }}>
          <h3>JPEG Preview:</h3>
          <img
            src={jpegUrl}
            alt="Converted DICOM"
            style={{ maxWidth: "100%" }}
          />
        </div>
      ) : (
        !error &&
        file && (
          <div style={{ marginTop: "10px", color: "#ccc" }}>
            Processing image...
          </div>
        )
      )}
    </div>
  );
};

export default DicomViewer;
