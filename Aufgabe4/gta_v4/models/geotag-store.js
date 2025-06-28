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


const e = require('express');
const GeoTagExamples = require ('./geotag-examples');

// Eine Klasse zum verwaltend und speichern von GeoTags
class InMemoryGeoTagStore {
    #geotags;

    // Dieser Konstruktor initialisieret die 'geotags' mit einer Liste von GeoTags, die aus 'tagList2' importiert werden
    constructor() {
        this.geotags = GeoTagExamples.tagList2;
    } 

    addGeoTag (geotag) {
        this.geotags.push (geotag);
    }

    // Entfernt einen GeoTag aus der Liste anhand seiner "id"
    removeGeoTag (id) {
        this.geotags = this.geotags.filter (geotag => geotag.id != id);
    } 

    getGeoTags() {
        return this.geotags;
    } 

    // Sucht und gibt einen GeoTag anhand seiner "id" zurück
    getGeoTagById (id) {
        return this.geotags.find (geotag => geotag.id === id);
    } 

    // Ausgabe als JSON-String
    getGeoTagsAsJSON() {
        return JSON.stringify (this.geotags);
    } 

    getNearbyGeoTags (location) {
        return this.geotags.filter (geotag => this.#isNearby (location, geotag));
    }

    getGeoTagByName(name){
        return this.#geotags.filter(geotag => this.geotag.name === name);
    }

    searchNearbyGeoTags(searchObject) {
        const normalizedSearchterm = searchObject.searchterm.toLowerCase();
        
        return this.geotags.filter(geotag => 
            this.#isNearby(searchObject, geotag) && 
            (
                (geotag.name && geotag.name.toLowerCase().includes(normalizedSearchterm)) || 
                (geotag.hashtag && geotag.hashtag.toLowerCase().includes(normalizedSearchterm))
            )
        );
    }
    
    searchByTagsNearLocation(searchObject) {
        const normalizedSearchterm = searchObject.searchterm.toLowerCase();

        if (searchObject.latitude !== undefined && searchObject.longitude !== undefined) {
            return this.geotags.filter(geotag => 
                this.#isNearby(searchObject, geotag) && 
                (
                    (geotag.name && geotag.name.toLowerCase().includes(normalizedSearchterm)) || 
                    (geotag.hashtag && geotag.hashtag.toLowerCase().includes(normalizedSearchterm))
                )
            );
        } else {
            return this.geotags.filter(geotag => 
                (
                    (geotag.name && geotag.name.toLowerCase().includes(normalizedSearchterm)) || 
                    (geotag.hashtag && geotag.hashtag.toLowerCase().includes(normalizedSearchterm))
                )
            );
        }
    }

    #isNearby (center, location2, r = 0.2) {
        var x = location2.latitude - center.latitude;
        var y = location2.longitude - center.longitude;
       return Math.sqrt(x*x + y*y) <= r;
    } 
}

module.exports = InMemoryGeoTagStore;

/* Suche anhand der id ist effizienter, da der Algorithmus nur die id des GeoTags verleichen muss. Sobald doe id gefunden ist, 
    wird das Element zurückgegeben. Bei der Suche anhand des Namens, müsste der Algorithmus durch die gesamte Liste iterieren
    und den Namen jedes GeoTags überprüfen. Dies ist in der Regel langsamer. */