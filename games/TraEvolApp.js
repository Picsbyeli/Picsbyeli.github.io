// TraEvolApp.js - Train & Evolve Your Drawings
import React, { useState, useEffect, useRef, useCallback } from "https://esm.sh/react@18";
import ReactDOM from "https://esm.sh/react-dom@18";

const TraEvolApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [drawings, setDrawings] = useState([]);
  const [currentDrawingName, setCurrentDrawingName] = useState("");
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const contextRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 300;
    canvas.height = window.innerHeight - 100;

    canvas.style.border = "2px solid #667eea";
    canvas.style.backgroundColor = "#0c0e14";
    canvas.style.cursor = "crosshair";
    canvas.style.borderRadius = "8px";

    const context = canvas.getContext("2d");
    context.fillStyle = "#0c0e14";
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;

    // Load drawings from localStorage
    const saved = localStorage.getItem("traevol_drawings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDrawings(parsed);
    }
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineWidth = brushSize;
    contextRef.current.lineCap = "round";
    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.fillStyle = "#0c0e14";
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    if (!currentDrawingName.trim()) {
      alert("Please enter a name for your drawing");
      return;
    }

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");

    const newDrawing = {
      id: Date.now(),
      name: currentDrawingName,
      image: imageData,
      date: new Date().toISOString(),
      version: 1,
    };

    const updatedDrawings = [...drawings, newDrawing];
    setDrawings(updatedDrawings);
    localStorage.setItem("traevol_drawings", JSON.stringify(updatedDrawings));

    setCurrentDrawingName("");
    clearCanvas();
    alert("Drawing saved!");
  };

  const loadDrawing = (drawing) => {
    const canvas = canvasRef.current;
    const img = new Image();
    img.onload = () => {
      contextRef.current.drawImage(img, 0, 0);
      setSelectedDrawing(drawing);
    };
    img.src = drawing.image;
  };

  const deleteDrawing = (id) => {
    if (confirm("Delete this drawing?")) {
      const updated = drawings.filter((d) => d.id !== id);
      setDrawings(updated);
      localStorage.setItem("traevol_drawings", JSON.stringify(updated));
      if (selectedDrawing?.id === id) {
        setSelectedDrawing(null);
        clearCanvas();
      }
    }
  };

  const evolveDrawing = () => {
    if (!selectedDrawing) {
      alert("Load a drawing first");
      return;
    }

    // Slightly modify the drawing for "evolution"
    const canvas = canvasRef.current;
    const imageData = contextRef.current.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    const data = imageData.data;

    // Add slight color shift as evolution
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 128) {
        // If alpha > 128
        data[i] = Math.min(255, data[i] + Math.random() * 20);
        data[i + 1] = Math.min(255, data[i + 1] + Math.random() * 20);
        data[i + 2] = Math.min(255, data[i + 2] + Math.random() * 20);
      }
    }

    contextRef.current.putImageData(imageData, 0, 0);

    // Create evolved version
    const newDrawing = {
      id: Date.now(),
      name: selectedDrawing.name + " v" + (selectedDrawing.version + 1),
      image: canvas.toDataURL("image/png"),
      date: new Date().toISOString(),
      version: selectedDrawing.version + 1,
    };

    const updated = [...drawings, newDrawing];
    setDrawings(updated);
    localStorage.setItem("traevol_drawings", JSON.stringify(updated));
    setSelectedDrawing(newDrawing);
    alert("Drawing evolved!");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0c0e14" }}>
      {/* Canvas */}
      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
        <h1 style={{ color: "#667eea", margin: "0 0 10px 0" }}>🧍 TraEvol - Train & Evolve</h1>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ flex: 1, marginBottom: "15px" }}
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={clearCanvas}
            style={{
              padding: "10px 20px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Clear Canvas
          </button>
          <input
            type="text"
            value={currentDrawingName}
            onChange={(e) => setCurrentDrawingName(e.target.value)}
            placeholder="Drawing name..."
            style={{
              padding: "10px",
              background: "#1f2937",
              color: "white",
              border: "1px solid #667eea",
              borderRadius: "6px",
              flex: 1,
            }}
          />
          <button
            onClick={saveDrawing}
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Save Drawing
          </button>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
          <label style={{ color: "#e8e6f0" }}>
            Brush Size:
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            />
          </label>
          <label style={{ color: "#e8e6f0" }}>
            Color:
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              style={{ marginLeft: "10px", cursor: "pointer", width: "50px", height: "40px" }}
            />
          </label>
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "rgba(255, 255, 255, 0.05)",
          borderLeft: "2px solid #667eea",
          padding: "20px",
          overflowY: "auto",
          color: "#e8e6f0",
        }}
      >
        <h2 style={{ marginTop: 0 }}>📚 Your Drawings</h2>
        {drawings.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No drawings yet. Create one!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                style={{
                  background: selectedDrawing?.id === drawing.id ? "#667eea" : "#1f2937",
                  padding: "10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <img
                  src={drawing.image}
                  alt={drawing.name}
                  onClick={() => loadDrawing(drawing)}
                  style={{
                    width: "100%",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginBottom: "8px",
                    cursor: "pointer",
                  }}
                />
                <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
                  <strong>{drawing.name}</strong>
                </p>
                <p style={{ margin: "5px 0", fontSize: "0.8rem", color: "#d1d5db" }}>
                  v{drawing.version}
                </p>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => loadDrawing(drawing)}
                    style={{
                      flex: 1,
                      padding: "5px",
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteDrawing(drawing.id)}
                    style={{
                      flex: 1,
                      padding: "5px",
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDrawing && (
          <button
            onClick={evolveDrawing}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "10px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.95rem",
            }}
          >
            ✨ Evolve Selected
          </button>
        )}
      </div>
    </div>
  );
};

// Mount the app
const root = document.getElementById("root");
ReactDOM.createRoot(root).render(React.createElement(TraEvolApp));
