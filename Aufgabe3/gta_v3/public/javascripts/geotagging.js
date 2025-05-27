// // File origin: VS1LAB A2

// /* eslint-disable no-unused-vars */

// // This script is executed when the browser loads index.html.

// // "console.log" writes to the browser's console. 
// // The console window must be opened explicitly in the browser.
// // Try to find this output in the browser...
// console.log("The geoTagging script is going to start...");

// ... your code here ...
// Definition eines Helfer-Objekts
const DOMHelper = {
    lat   : document.getElementById ("latitude-tagg"),
    latd  : document.getElementById ("latitude-discovery"),
    long  : document.getElementById ("longitude-tagg"),
    longd : document.getElementById ("longitude-discovery"),
    map   : document.getElementById ("map")
}

/* TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded. */
function updateLocation() {
    if (DOMHelper.lat.value === "" || DOMHelper.long.value === "") 
        LocationHelper.findLocation (setLocation);
     else
        setLocation ({latitude: DOMHelper.lat.value, longitude: DOMHelper.long.value});
}

/* Funktion setzt die Werte der Eingabe- und Discovery-Felder für Breiten- und Längengrad
    mit den übergebenen Koordinaten */
function setLocation (l) {
    DOMHelper.lat.value = l.latitude;
    DOMHelper.latd.value = l.latitude;
    DOMHelper.long.value = l.longitude;
    DOMHelper.longd.value = l.longitude;
    
    var mapManager = new MapManager();
    var geotags = JSON.parse (DOMHelper.map.getAttribute ("data-geotags"));
    mapManager.initMap (l.latitude, l.longitude, 13); 
    console.log(geotags);
    mapManager.updateMarkers (l.latitude, l.longitude, geotags);
    
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener ("DOMContentLoaded", () => { updateLocation(); });
