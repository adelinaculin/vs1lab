// File origin: VS1LAB A3

/* This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation. */

/* A class for in-memory-storage of geotags
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. */

// Klasse zur Verwaltung von GeoTags im Speicher

const GeoTagExamples = require ('./geotag-examples');

class InMemoryGeoTagStore {
    #geotags;

    // TODO: ... your code here ...
    // Dieser Konstruktor initialisieret die 'geotags' mit einer Liste von GeoTags, die aus 'tagList2' importiert werden
    constructor(){
        this.geotags = GeoTagExamples.tagList2;
    }

    addGeoTag (geotag){
        this.geotags.push (geotag);
    }

    removeGeoTag (name){
        this.geotags = this.geotags.filter (geotag => geotag.name != name);
    }

    getGeoTags() {
        return this.geotags;
    }

    // Ausgabe als JSON-String
    getGeoTagsAsJSON() {
        return JSON.stringify (this.geotags);
    }

    getNearbyGeoTags (location) {
        return this.geotags.filter(geotag => this.#isNearby (location, geotag));
    }

    searchNearbyGeoTags (searchObject){
        const searchTerm = searchObject.searchTerm.toLowerCase();
        return this.geotags.filter (geotag => this.#isNearby (searchObject, geotag) && 
        (
            geotag.name.toLowerCase().includes (searchTerm) || 
            geotag.hashtag.toLowerCase().includes (searchTerm)
        ));
    }

    #isNearby(center, location2, r = 10000){
        var x = location2.latitude - center.latitude;
        var y = location2.longitude - center.longitude;
       return Math.sqrt(x*x + y*y) <= r;
    }

    /*
        #isNearby(center, location2, radius) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (location2.latitude - center.latitude) * Math.PI / 180;
        const dLon = (location2.longitude - center.longitude) * Math.PI / 180;
        const a = 
            0.5 - Math.cos(dLat) / 2 + 
            Math.cos(center.latitude * Math.PI / 180) * Math.cos(location2.latitude * Math.PI / 180) * 
            (1 - Math.cos(dLon)) / 2;
        
        const distance = R * 2 * Math.asin(Math.sqrt(a));
        return distance <= radius;
    }
    */
}

module.exports = InMemoryGeoTagStore;
