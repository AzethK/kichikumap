import { useRef, useState, useEffect } from "react";
import MapImage from "./MapImage";
import MarkerLayer from "./MarkerLayer";

const MAP_WIDTH = 4920;
const MAP_HEIGHT = 2050;

const MAX_SCALE = 3;

export default function MapViewport() {
  const [editorMode, setEditorMode] = useState(true); // TEMP
  const [tempMarker, setTempMarker] = useState(null);

  // Calculate the minimum scale to fit the map within the viewport
  const getMinScale = () => {
    const viewport = containerRef.current;
    if (!viewport) return 1;

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    const scaleX = viewportWidth / MAP_WIDTH;
    const scaleY = viewportHeight / MAP_HEIGHT;

    return Math.max(scaleX, scaleY);
  };

  // Ref for the container
  const containerRef = useRef(null);

  // State for position and scale
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Refs for dragging
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Clamp function to restrict position within bounds
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // Function to clamp position based on current scale
  const clampPosition = (x, y, scale) => {
    const viewport = containerRef.current;
    if (!viewport) return { x, y };

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    const mapWidth = MAP_WIDTH * scale;
    const mapHeight = MAP_HEIGHT * scale;

    const minX = Math.min(0, viewportWidth - mapWidth);
    const minY = Math.min(0, viewportHeight - mapHeight);

    return {
      x: clamp(x, minX, 0),
      y: clamp(y, minY, 0),
    };
  };

  // Effect to handle wheel zooming
  useEffect(() => {
    const viewport = containerRef.current;
    if (!viewport) return;

    const wheelHandler = (e) => {
      handleWheel(e);
    };

    viewport.addEventListener("wheel", wheelHandler, {
      passive: false,
    });

    return () => {
      viewport.removeEventListener("wheel", wheelHandler);
    };
  }, [scale, position]);

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      const minScale = getMinScale();
      setScale((s) => Math.max(s, minScale));
      setPosition((p) => clampPosition(p.x, p.y, Math.max(scale, minScale)));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [scale]);

  /* -------------------- Drag logic -------------------- */

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;

    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    const clamped = clampPosition(newX, newY, scale);
    setPosition(clamped);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMapClick = (e) => {
    if (!editorMode) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = Math.round((mouseX - position.x) / scale);
    const worldY = Math.round((mouseY - position.y) / scale);
    setTempMarker({ x: worldX, y: worldY });

    console.log(
      `{ id: "new_area_id", name: "New Area", x: ${worldX}, y: ${worldY}, type: "city" },`
    );
  };

  /* -------------------- Zoom logic -------------------- */

  const handleWheel = (e) => {
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const rawScale = scale * zoomFactor;

    const minScale = getMinScale();
    const newScale = Math.min(MAX_SCALE, Math.max(minScale, rawScale));

    const scaleRatio = newScale / scale;

    const newX = mouseX - scaleRatio * (mouseX - position.x);
    const newY = mouseY - scaleRatio * (mouseY - position.y);

    const clamped = clampPosition(newX, newY, newScale);

    setScale(newScale);
    setPosition(clamped);
  };

  /* -------------------- Render -------------------- */

  return (
    <div
      ref={containerRef}
      className="map-viewport"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="map-layer"
        onClick={handleMapClick}
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {tempMarker && (
          <div
            style={{
              position: "absolute",
              left: tempMarker.x,
              top: tempMarker.y,
              width: 8,
              height: 8,
              background: "red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        )}

        <MapImage />
        <MarkerLayer />

        {/*
          Future layers go here:
          <MarkerLayer />
          <RegionLayer />
        */}
      </div>
    </div>
  );
}
