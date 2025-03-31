import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { LatLngExpression } from "leaflet";

export const DEFAULT_POSITION = { lat: 16.068, lng: 108.212 };

const RequestCreate: React.FC<{
  position: LatLngExpression;
  address: string;
}> = ({ position, address }) => {
  const currentPosition = position || DEFAULT_POSITION;

  return (
    <MapContainer
      center={currentPosition}
      zoom={15}
      style={{ height: "30vh", width: "100%" }}
      data-oid="_4r_70s"
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        data-oid="vsus3cv"
      />

      <LocationMarker
        address={address}
        currentPosition={currentPosition}
        data-oid="lqrt9oh"
      />
    </MapContainer>
  );
};

type LocationMarkerProps = {
  currentPosition: LatLngExpression;
  address: string | undefined;
};

const LocationMarker: React.FC<LocationMarkerProps> = ({
  currentPosition,
  address,
}) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(currentPosition);
  }, [map, currentPosition]);

  return currentPosition === null ? null : (
    <Marker position={currentPosition} data-oid="89z:o46">
      <Popup keepInView data-oid="yl8__ae">
        {address}
      </Popup>
    </Marker>
  );
};

export default RequestCreate;
