// File origin: VS1LAB A2 

// Leaflet-Karte

class MapManager {
    #map
    #markers
    #defaultIcon

    /* Dieser Konstruktor initialisiert das '#defaultIcon' mit den angegebenen Attributen für das Icon und dessen Schatten.
        Diese Icons werden Später für die Marker auf der Karte verwendet. */
    constructor() {
        this.#defaultIcon = L.icon ({
            iconUrl: '/images/marker.svg',
            shadowUrl: '/images/marker-shadow.svg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    /* Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18 */

     initMap (latitude, longitude, zoom = 18) { 
        // set up dynamic Leaflet map
        this.#map = L.map ('map').setView ([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer ('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'}).addTo (this.#map);
        this.#markers = L.layerGroup().addTo (this.#map);
    }

    /* Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location */

    updateMarkers (latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker ([latitude, longitude], {icon: this.#defaultIcon})
            .bindPopup ("Your Location")
            .addTo (this.#markers);
        for (const tag of tags) {
            L.marker ([tag.latitude, tag.longitude], {icon: this.#defaultIcon})
                .bindPopup (tag.name)
                .addTo (this.#markers);  
        }
    }
 
}
