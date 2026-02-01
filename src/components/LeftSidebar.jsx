export default function LeftSidebar({ onOpenSubordinates, open, onOpenItems }) {
  return (
    <aside className={`left-sidebar ${open ? "open" : "closed"}`}>
      <button className="sidebar-button" onClick={onOpenSubordinates}>
        Characters
      </button>
      <button className="sidebar-button" onClick={onOpenItems}>
        Items
      </button>
    </aside>
  );
}
