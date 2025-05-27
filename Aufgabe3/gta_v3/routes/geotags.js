const express = require('express');
const router = express.Router();
const GeoTagStore = require('../models/geotag-store');

router.get('/api/geotags', (req, res) => {
  const { latitude, longitude, searchterm } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing coordinates." });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  let results;
  if (searchterm && searchterm.trim() !== "") {
    results = GeoTagStore.searchNearbyGeoTags(lat, lon, 1.0, searchterm);
  } else {
    results = GeoTagStore.getNearbyGeoTags(lat, lon, 1.0);
  }

  res.json(results);
});

module.exports = router;
