import { useRef, useState, useEffect } from "react";
import MapImage from "./MapImage";
import MarkerLayer from "./MarkerLayer";

const MAP_WIDTH = 4920;
const MAP_HEIGHT = 2050;

const MAX_SCALE = 3;

export default function MapViewport({ onAreaClick }) {
  const isPinching = useRef(false);
  const [editorMode, setEditorMode] = useState(false); // TEMP
  const [tempMarker, setTempMarker] = useState(null);

  const pointers = useRef(new Map());
  const pinchStartDistance = useRef(null);
  const pinchStartScale = useRef(1);

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

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // If two fingers → enter pinch mode
    if (pointers.current.size === 2) {
      isPinching.current = true;
      isDragging.current = false;

      const [p1, p2] = Array.from(pointers.current.values());

      pinchStartDistance.current = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      pinchStartScale.current = scale;

      return;
    }

    // Only allow drag if NOT pinching
    if (!isPinching.current && pointers.current.size === 1) {
      if (e.target.closest(".map-marker")) return;

      isDragging.current = true;

      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handlePointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;

    pointers.current.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
    });

    // PINCH MODE
    if (isPinching.current && pointers.current.size === 2) {
      const rect = containerRef.current.getBoundingClientRect();

      const [p1, p2] = Array.from(pointers.current.values());

      // Distance between fingers
      const newDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      const distanceRatio = newDistance / pinchStartDistance.current;

      const rawScale = pinchStartScale.current * distanceRatio;
      const minScale = getMinScale();
      const newScale = Math.min(MAX_SCALE, Math.max(minScale, rawScale));

      const scaleRatio = newScale / scale;

      //Midpoint between fingers (screen space)
      const centerX = (p1.x + p2.x) / 2 - rect.left;
      const centerY = (p1.y + p2.y) / 2 - rect.top;

      const newX = centerX - scaleRatio * (centerX - position.x);
      const newY = centerY - scaleRatio * (centerY - position.y);

      const clamped = clampPosition(newX, newY, newScale);

      setScale(newScale);
      setPosition(clamped);

      return;
    }

    // DRAG MODE
    if (!isPinching.current && isDragging.current) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;

      const clamped = clampPosition(newX, newY, scale);
      setPosition(clamped);
    }
  };

  const handlePointerUp = (e) => {
    pointers.current.delete(e.pointerId);

    // If fewer than 2 fingers → stop pinch
    if (pointers.current.size < 2) {
      isPinching.current = false;
      pinchStartDistance.current = null;
    }

    // If no fingers → stop drag
    if (pointers.current.size === 0) {
      isDragging.current = false;
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // const handleMapClick = (e) => {
  //   if (!editorMode) return;

  //   const rect = containerRef.current.getBoundingClientRect();
  //   const mouseX = e.clientX - rect.left;
  //   const mouseY = e.clientY - rect.top;

  //   const worldX = Math.round((mouseX - position.x) / scale);
  //   const worldY = Math.round((mouseY - position.y) / scale);
  //   setTempMarker({ x: worldX, y: worldY });

  //   console.log(
  //     `{ id: "new_area_id", name: "New Area", x: ${worldX}, y: ${worldY}, type: "city" },`,
  //   );
  // };

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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="map-layer"
        // onClick={handleMapClick}
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
        <MarkerLayer onAreaClick={onAreaClick} />
      </div>
    </div>
  );
}
