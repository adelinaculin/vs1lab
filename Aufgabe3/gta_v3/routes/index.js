// File origin: VS1LAB A3

/* This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation. */

// Define module dependencies.
const express = require('express');
const router = express.Router();

// The module "geotag" exports a class GeoTagStore. It represents geotags.
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

// The module "geotag-store" exports a class GeoTagStore. It provides an in-memory store for geotag objects.
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');


/* Route '/' for HTTP 'GET' requests. (http://expressjs.com/de/4x/api.html#app.get.method)
 * Requests cary no parameters
 * As response, the ejs-template is rendered without geotag objects. */
// TODO: extend the following route example if necessary
const InMemoryGeoTagStore = new GeoTagStore();

router.get('/', (req, res) => {
  res.render('index', {
    taglist: InMemoryGeoTagStore.getGeoTags(),
    set_latitude: "",
    set_longitude: "",
    tagsJSON: InMemoryGeoTagStore.getGeoTagsAsJSON()
  });
});


/* Route '/tagging' for HTTP 'POST' requests. (http://expressjs.com/de/4x/api.html#app.post.method)
 * Requests cary the fields of the tagging form in the body. (http://expressjs.com/de/4x/api.html#req.body)
 * Based on the form data, a new geotag is created and stored.
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location. */
// TODO: ... your code here ...
router.post('/tagging',(req, res)=> {
  console.log(req.body);

  var g = new GeoTag(req.body.tagname, req.body.hashtag, req.body.latitude, req.body.longitude)
   
  InMemoryGeoTagStore.addGeoTag(g);
  var nearbyTags = InMemoryGeoTagStore.getNearbyGeoTags(g);
  
  res.render("index", { 
    taglist: nearbyTags,
    set_latitude: g.latitude,
    set_longitude: g.longitude, 
    tagsJSON: JSON.stringify(nearbyTags)
  });   
});


/* Route '/discovery' for HTTP 'POST' requests. (http://expressjs.com/de/4x/api.html#app.post.method)
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term. (http://expressjs.com/de/4x/api.html#req.body)
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags by radius and keyword. */
// TODO: ... your code here ...
router.post('/discovery',(req, res)=> {
  console.log(req.body);
  var s = {searchTerm: req.body.search_term, latitude: req.body.latitude, longitude: req.body.longitude};
  var nearbyTagsBySearch = InMemoryGeoTagStore.searchNearbyGeoTags(s);

  res.render("index", { 
    taglist: nearbyTagsBySearch,
    set_latitude: s.latitude,
    set_longitude: s.longitude,
    tagsJSON: JSON.stringify(nearbyTagsBySearch)
  });   
});

module.exports = router;
