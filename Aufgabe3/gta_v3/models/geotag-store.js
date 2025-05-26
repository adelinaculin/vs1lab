// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
// File origin: VS1LAB A3

const GeoTag = require('./geotag');

class InMemoryGeoTagStore {
  // Konstruktor: internes Array zur Speicherung der GeoTags
  constructor() {
    this._geoTags = [];
  }

  // Fügt ein neues GeoTag hinzu
  addGeoTag(geoTag) {
    this._geoTags.push(geoTag);
  }

  // Entfernt GeoTags mit dem gegebenen Namen
  removeGeoTag(name) {
    this._geoTags = this._geoTags.filter(tag => tag.name !== name);
  }

  // Gibt alle GeoTags im Umkreis von radius (in km) um lat/lon zurück
  getNearbyGeoTags(lat, lon, radius = 10) {
    return this._geoTags.filter(tag => 
      this._distance(lat, lon, tag.latitude, tag.longitude) <= radius
    );
  }

  // Gibt GeoTags im Umkreis zurück, die zusätzlich ein Keyword enthalten
  searchNearbyGeoTags(lat, lon, radius, keyword) {
    return this.getNearbyGeoTags(lat, lon, radius).filter(tag =>
      tag.name.toLowerCase().includes(keyword.toLowerCase()) ||
      tag.hashtag.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Hilfsmethode zur Berechnung der Entfernung zweier Koordinaten (Haversine)
  _distance(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371; // Erdradius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

module.exports = InMemoryGeoTagStore;
