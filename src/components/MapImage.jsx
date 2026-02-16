import continent from "../assets/continent.svg";
export default function MapImage() {
  return (
    <img
      src={continent}
      alt="Kichikuou Rance Map"
      draggable={false}
      className="map-content"
    />
  );
}
