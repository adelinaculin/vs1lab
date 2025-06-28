// File origin: VS1LAB A2

console.log("The geoTagging script is going to start...");

// Definition eines Helfer-Objekts
const DOMHelper = {
    lat: document.getElementById("latitude-tagg"),
    latd: document.getElementById("latitude-discovery"),
    long: document.getElementById("longitude-tagg"),
    longd: document.getElementById("longitude-discovery"),
    map: document.getElementById("map"),
    resultsList: document.getElementById("discoveryResults"),
};

// MapManager-Instanz
const mapManager = new MapManager();

/**
 * Aktualisiert die aktuelle Benutzerposition und initialisiert die Karte.
 */
function updateLocation() {
    if (!DOMHelper.lat.value || !DOMHelper.long.value) {
        LocationHelper.findLocation(setLocation);
    } else {
        setLocation({
            latitude: DOMHelper.lat.value,
            longitude: DOMHelper.long.value,
        });
    }
}

/**
 * Setzt die Breiten- und LÃ¤ngengrade und aktualisiert die Karte.
 * @param {{ latitude: number, longitude: number }} location
 */
function setLocation(location) {
    DOMHelper.lat.value = location.latitude;
    DOMHelper.latd.value = location.latitude;
    DOMHelper.long.value = location.longitude;
    DOMHelper.longd.value = location.longitude;

    const geotags = JSON.parse(DOMHelper.map.getAttribute("data-geotags") || "[]");
    mapManager.initMap(location.latitude, location.longitude, 13);
    mapManager.updateMarkers(location.latitude, location.longitude, geotags);
}

/**
 * Handhabt die Einreichung des Tagging-Formulars.
 */
async function handleTaggingForm() {
    const name = document.getElementById("tagname").value;
    const latitude = parseFloat(DOMHelper.lat.value);
    const longitude = parseFloat(DOMHelper.long.value);
    const hashtag = document.getElementById("hashtag-tagg").value;

    const requestBody = { name, latitude, longitude, hashtag };

    try {
        const response = await fetch("/api/geotags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error("Failed to add GeoTag");

        const allTagsResponse = await fetch("/api/geotags");
        if (!allTagsResponse.ok) throw new Error("Failed to fetch GeoTags after adding a new one");

        const allTags = await allTagsResponse.json();
        updateResultsList(allTags);
        mapManager.updateMarkers(latitude, longitude, allTags);

        console.log("GeoTag added and map updated!");
    } catch (error) {
        console.error("Error while adding GeoTag:", error);
    }
}

/**
 * Handhabt die Einreichung des Discovery-Formulars.
 */
async function handleDiscoveryForm() {
    const searchTerm = document.getElementById("searchterm").value;
    const latitude = DOMHelper.latd.value;
    const longitude = DOMHelper.longd.value;

    const queryParams = new URLSearchParams({
        searchterm: searchTerm,
        latitude: latitude,
        longitude: longitude,
    });

    try {
        const response = await fetch(`/api/geotags?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to search GeoTags");

        const results = await response.json();
        updateResultsList(results);
        mapManager.updateMarkers(latitude, longitude, results);

        console.log("Search results updated!");
    } catch (error) {
        console.error("Error while searching GeoTags:", error);
    }
}

/**
 * Aktualisiert die Ergebnisliste auf der Seite.
 * @param {{ name: string, latitude: number, longitude: number, hashtag: string }[]} geoTags
 */
function updateResultsList(geoTags) {
    DOMHelper.resultsList.innerHTML = "";
    geoTags.forEach((tag) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;
        DOMHelper.resultsList.appendChild(listItem);
    });
}

/**
 * Initialisiert die Seite.
 */
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    const taggingForm = document.getElementById("tag-form");
    taggingForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await handleTaggingForm();
    });

    const discoveryForm = document.getElementById("discoveryFilterForm");
    discoveryForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await handleDiscoveryForm();
    });
});