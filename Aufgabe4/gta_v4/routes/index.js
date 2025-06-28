// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require ('express');
const router = express.Router();

const GeoTag = require ('../models/geotag');

const GeoTagStore = require ('../models/geotag-store');

const InMemoryGeoTagStore = new GeoTagStore();

// Diese Route rendert die "index.ejs"-Seite und stellt dabei Informationen über GeoTags bereit
// Definiert eine Route für HTTP GET-Anfragen auf der Wurzel ("/"). Beim Aufruf rendert sie die Ansicht mit Daten aus "InMemoryGeoTagStore"
router.get ('/', (req, res) => {
  res.render ("index", {
    taglist: InMemoryGeoTagStore.getGeoTags(),
    set_latitude: "",
    set_longitude: "",
    tagsJSON: InMemoryGeoTagStore.getGeoTagsAsJSON()
  });
}); 


// API routes (A4)

/* Route '/api/geotags' for HTTP 'GET' requests. (http://expressjs.com/de/4x/api.html#app.get.method)
 * Requests contain the fields of the Discovery form as query. (http://expressjs.com/de/4x/api.html#req.query)
 * As a response, an array with Geo Tag objects is rendered as JSON. If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius. */
/* Diese Route ermöglicht das Abrufen von GeoTags über HTTP GET-Anfragen auf "/api/geotags". Abhängig von den Parametern in der 
    Anfrage (Query-Parameter) werden entweder alle GeoTags zurückgegeben oder nur diejenigen, die sich in der nähe befinden */
router.get ('/api/geotags', (req, res) => {
  var query = {searchterm: req.query.searchterm, latitude: req.query.latitude, longitude: req.query.longitude};

  if (query.searchterm === undefined) {
    return res.json (InMemoryGeoTagStore.getGeoTags());
  } else {
   //Ausgabe der GeoTags, die den Suchparametern entsprechen
    res.json (InMemoryGeoTagStore.searchByTagsNearLocation(query)); 
  }
}); 


/* Route '/api/geotags' for HTTP 'POST' requests. (http://expressjs.com/de/4x/api.html#app.post.method)
 * Requests contain a GeoTag as JSON in the body. (http://expressjs.com/de/4x/api.html#req.body)
 * The URL of the new resource is returned in the header as a response. The new resource is rendered as JSON in the response. */
/* Diese Route ermöglicht das Erstellen eines neuen GeoTags über HTTP POST-Anfragen auf "/api/geotags". Das GeoTag wird
    basierend auf den Anforderungsdaten im JSON-Format erstellt und als JSON-Objekt zurückgegeben. Der Location-Header
    enthält die URL der neu erstellten Ressource */
router.post ("/api/geotags", (req, res) => { 
  console.log (req.body);
  var newGeoTag = new GeoTag (req.body.name, req.body.hashtag, req.body.latitude, req.body.longitude);

  InMemoryGeoTagStore.addGeoTag (newGeoTag);  // neues Objekt dem Speicher hinzufügen
  res.setHeader ("Location", "/api/geotags/" + newGeoTag.id);
  res.json (newGeoTag);
}); 

/* Route '/api/geotags/:id' for HTTP 'GET' requests. (http://expressjs.com/de/4x/api.html#app.get.method)
 * Requests contain the ID of a tag in the path. (http://expressjs.com/de/4x/api.html#req.params)
 * The requested tag is rendered as JSON in the response. */
// Diese Route wird verwendet, um ein einzelnes GeoTag anhand seiner id abzurufen
router.get ("/api/geotags/:id", (req, res) => {
  var geoTag = InMemoryGeoTagStore.getGeoTagById (parseInt (req.params.id));
  if (!geoTag) 
    return res.status (404).json ({error: "GeoTag not found"});
  res.json (geoTag);
});

/* Route '/api/geotags/:id' for HTTP 'PUT' requests. (http://expressjs.com/de/4x/api.html#app.put.method)
 * Requests contain the ID of a tag in the path. (http://expressjs.com/de/4x/api.html#req.params) 
 * Requests contain a GeoTag as JSON in the body. (http://expressjs.com/de/4x/api.html#req.query)
 * Changes the tag with the corresponding ID to the sent value. The updated resource is rendered as JSON in the response.  */
// Diese Route wird verwendet, um ein vorhandenes GeoTag mit einer bestimmten id zu aktualisieren
router.put ("/api/geotags/:id", (req, res) => {
  var geoTag = InMemoryGeoTagStore.getGeoTagById (parseInt (req.params.id)); // id wird von dem gefundenen GeoTag extrahiert

  if (!geoTag)
    return res.status (404).json ({error: "GeoTag not found"});

  geoTag.name = req.body.name;
  geoTag.hashtag = req.body.hashtag;
  geoTag.latitude = req.body.latitude;
  geoTag.longitude = req.body.longitude;

  res.json (geoTag);
}); 


/* Route '/api/geotags/:id' for HTTP 'DELETE' requests. (http://expressjs.com/de/4x/api.html#app.delete.method)
 * Requests contain the ID of a tag in the path. (http://expressjs.com/de/4x/api.html#req.params)
 * Deletes the tag with the corresponding ID. The deleted resource is rendered as JSON in the response. */
// Diese Route löscht ein GeoTag anhand seiner id
router.delete ("/api/geotags/:id", (req, res) => {
  var geoTag = InMemoryGeoTagStore.getGeoTagById (parseInt(req.params.id));  // id extrahiert

  if (!geoTag)
    return res.status (404).json ({error: "GeoTag not found"});

  InMemoryGeoTagStore.removeGeoTag (geoTag.id);                    // diese id wird dann vom Speicher entfernt
  res.json (geoTag);
}); 

module.exports = router;