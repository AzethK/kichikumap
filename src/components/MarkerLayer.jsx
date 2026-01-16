import { areas } from "./areas";

export default function MarkerLayer() {
  return (
    <>
      {areas.map((area) => (
        <button
          key={area.id}
          className="map-marker"
          style={{
            position: "absolute",
            left: area.x,
            top: area.y,
          }}
          onClick={() => {
            console.log("Clicked:", area.name);
          }}
        >
          {area.name}
        </button>
      ))}
    </>
  );
}
