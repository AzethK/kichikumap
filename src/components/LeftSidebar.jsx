import { useAppContext } from "../App";
import { regionIcons } from "../data/regionIcons";

export default function LeftSidebar({
  onOpenSubordinates,
  open,
  onOpenItems,
  toggleCensor,
}) {
  const { censoredMode, enabledRegions, setEnabledRegions, search, setSearch } =
    useAppContext();

  const toggleRegion = (region) => {
    setEnabledRegions((prev) =>
      prev.includes(region) ?
        prev.filter((r) => r !== region)
      : [...prev, region],
    );
  };

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

      <div className="region-section">
        <div className="region-header">Displayed Regions</div>

        <div className="region-grid">
          {Object.entries(regionIcons).map(([region, icon]) => {
            const enabled = enabledRegions.includes(region);

            return (
              <button
                key={region}
                className={`region-button ${enabled ? "enabled" : "disabled"}`}
                onClick={() => toggleRegion(region)}
              >
                <img src={icon} alt={region} draggable={false} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="region-section">
        <div className="region-header">Search Areas</div>
        <div className="character-search">
          <input
            type="text"
            placeholder="Area, character, enemy, item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}
