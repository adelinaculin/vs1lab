// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

const GeoTag = require('../models/geotag');
const GeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

// Initialisiere den Speicher und lade Beispieldaten einmalig
const geoTagStore = new GeoTagStore();
GeoTagExamples.tagList.forEach(([name, lat, lon, hashtag]) => {
    geoTagStore.addGeoTag(new GeoTag(name, lat, lon, hashtag));
});

/**
 * Route '/' for HTTP 'GET' requests.
 */
router.get('/', (req, res) => {
  res.render('index', { taglist: [] });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * Speichert neues GeoTag und gibt nahegelegene Tags zurück.
 */
router.post('/tagging', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  const newTag = new GeoTag(name, lat, lon, hashtag);
  geoTagStore.addGeoTag(newTag);

  const nearbyTags = geoTagStore.getNearbyGeoTags(lat, lon);

  res.render('index', {
    taglist: nearbyTags,
    latitude: lat,
    longitude: lon
  });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * Gibt nahegelegene Tags zurück, optional gefiltert nach Suchbegriff.
 */
router.post('/discovery', (req, res) => {
  const { latitude, longitude, searchterm } = req.body;
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const term = searchterm ? searchterm.trim() : '';

  let results = [];
  if (term) {
    results = geoTagStore.searchNearbyGeoTags(lat, lon, term);
  } else {
    results = geoTagStore.getNearbyGeoTags(lat, lon);
  }

  res.render('index', {
    taglist: results,
    latitude: lat,
    longitude: lon,
    searchterm: term
  });
});
// API: Nearby GeoTags ohne Filter
router.get('/api/geotags', (req, res) => {
  const { latitude, longitude } = req.query;
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  const nearbyTags = geoTagStore.getNearbyGeoTags(lat, lon, 1.0); // Radius: 1 km
  res.json(nearbyTags);
});

module.exports = router;
