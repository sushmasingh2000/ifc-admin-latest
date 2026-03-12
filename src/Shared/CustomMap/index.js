

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const FitBounds = ({ locations }) => {
    const map = useMap();

    React.useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations, map]);

    return null;
};

const CustomMap = ({ locations = [], onClose }) => {
    const createIcon = (img, type) =>
        L.divIcon({
            html: `
                <div class="marker-container" style="position: relative;">
                    <img src="${img}" style="width:38px;height:38px;border-radius:50%;border:2px solid ${
                        type === "IN" ? "red" : "blue"
                    };" />
                    <div class="blink-dot" style="
                        position:absolute;
                        top:-5px;
                        right:-5px;
                        width:10px;
                        height:10px;
                        background:${type === "IN" ? "red" : "blue"};
                        border-radius:50%;
                        animation: blink 1s infinite;
                    "></div>
                </div>
            `,
            className: "",
        });

    const latlngs = locations.map((loc) => [loc.lat, loc.lng]);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white p-3 rounded-lg shadow-lg w-[90%] h-[70%]"
                onClick={(e) => e.stopPropagation()}
            >
                <MapContainer
                    center={[locations[0]?.lat || 0, locations[0]?.lng || 0]}
                    zoom={13}
                    minZoom={10}
                    scrollWheelZoom={true}
                    className="w-full h-full rounded"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {locations.map((loc, idx) => (
                        <React.Fragment key={idx}>
                            <Marker
                                position={[loc.lat, loc.lng]}
                                icon={createIcon(loc.img, loc.type)}
                            >
                                <Popup>
                                    <div className="text-sm">
                                        {loc.address} ({loc.type})
                                    </div>
                                </Popup>
                            </Marker>
                            
                            {/* Draw the radius circle */}
                            {loc.radius && (
                                <Circle
                                    center={[loc.lat, loc.lng]}
                                    radius={Number(loc.radius)} // in meters
                                    pathOptions={{
                                        color: loc.type === "IN" ? "red" : "blue",
                                        fillColor: loc.type === "IN" ? "red" : "blue",
                                        fillOpacity: 0.2,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}

                    {latlngs.length > 1 && (
                        <Polyline positions={latlngs} color="red" weight={6} dashArray="10, 10" />
                    )}

                    <FitBounds locations={locations} />
                </MapContainer>

                <button
                    onClick={onClose}
                    className="mt-3 px-4 py-1 bg-red-500 text-white rounded"
                >
                    Close
                </button>
            </div>

            <style>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default CustomMap;
