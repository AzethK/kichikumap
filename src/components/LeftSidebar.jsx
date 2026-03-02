import { useAppContext } from "../App";

export default function LeftSidebar({
  onOpenSubordinates,
  open,
  onOpenItems,
  toggleCensor,
}) {
  const { censoredMode } = useAppContext();
  return (
    <aside className={`left-sidebar ${open ? "open" : "closed"}`}>
      <button className="sidebar-button" onClick={onOpenSubordinates}>
        Characters
      </button>
      <button className="sidebar-button" onClick={onOpenItems}>
        Items
      </button>
      <button className="sidebar-button" onClick={toggleCensor}>
        {`Toggle Censor | Current : ${censoredMode ? "Active" : "Inactive"}`}
      </button>
    </aside>
  );
}
