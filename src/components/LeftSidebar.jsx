import { useState } from "react";

export default function LeftSidebar({ onOpenSubordinates }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`left-sidebar ${hovered ? "visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button className="sidebar-button" onClick={onOpenSubordinates}>
        Subordinates
      </button>
    </div>
  );
}
