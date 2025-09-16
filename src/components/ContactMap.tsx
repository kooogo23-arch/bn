import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour un bug courant avec Vite/Webpack où les icônes de marqueur ne s'affichent pas.
// On importe manuellement les images et on les assigne à l'icône par défaut de Leaflet.
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ContactMap = () => {
    const position: [number, number] = [11.3236, -12.2864]; // Coordonnées de Labé, Guinée

    return (
        <div className="map-container">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '450px', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup><b>Booklite</b><br />Nos bureaux à Labé, Guinée.</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default ContactMap;