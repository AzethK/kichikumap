export default function LeftSidebar({ onOpenSubordinates, open }) {
  return (
    <aside className={`left-sidebar ${open ? "open" : "closed"}`}>
      <button className="sidebar-button" onClick={onOpenSubordinates}>
        Subordinates
      </button>
    </aside>
  );
}
