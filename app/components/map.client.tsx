import type { LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { OverpassJson, OverpassNode } from "~/utils/types.server";

export function Map({ height, pois }: { height: string; pois: OverpassJson }) {
  const initialPosition: LatLngTuple = [51.505, -0.09];
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>();
  const position = [
    currentPosition?.coords?.latitude || initialPosition[0],
    currentPosition?.coords?.longitude || initialPosition[1],
  ] as LatLngTuple;

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCurrentPosition);
      }
    };
    getLocation();
  }, []);
  let markers = [];
  if (pois.elements.length) {
    for (let i = 0; i < pois.elements.length; i++) {
      const node = pois.elements[i] as OverpassNode;
      markers.push({
        id: pois.elements[i].id,
        name: node.tags?.name,
        position: [node.lat, node.lon] as LatLngTuple,
      });
    }
  }
  const Leaflet = window.L;
  const myMarkerIcon = Leaflet.divIcon({
    className: "rounded-xl bg-red-500 animate-pulse",
  });
  return (
    <div className="w-full h-96">
      <MapContainer
        style={{
          height: "100%",
        }}
        center={position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} autoPan={true} icon={myMarkerIcon} />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>{m.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
