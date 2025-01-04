<template>
    <v-container fluid>
      <div id="map" class="map-container"></div>
    </v-container>  
</template>

<script setup>
import { onMounted } from 'vue'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'
import { Protocol, PMTiles } from 'pmtiles'


onMounted(async () => {
  // create a protocol and a source to it
  const protocol = new Protocol()
  maplibregl.addProtocol('pmtiles', protocol.tile)
  const PMTILES_URL = 'https://geovizbucket.s3.us-west-2.amazonaws.com/swiss_gemeinden.pmtiles'
  const p = new PMTiles(PMTILES_URL)
  protocol.add(p)
  // grab the hader to later use zoom and centering values
  const header = await p.getHeader()
  // create the map obkect, bind it to the 'map' div in the template
  const map = new maplibregl.Map({
    container: 'map',
    zoom: header.maxZoom - 3,
    center: [header.centerLon, header.centerLat],
    style: "https://demotiles.maplibre.org/style.json"
  })
  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('load', () => {
      // 2a. Add a new source (vector or raster) 
      // Example: a vector tileset
      map.addSource('swiss_gemeinden', {
        type: 'vector',
        url: `pmtiles://${PMTILES_URL}`,
      });

      // 2b. Add a layer referencing the new source
      // Make sure the 'source-layer' matches the layer name inside the tile set if vector
      map.addLayer({
        id: 'gdf_gemeinden',
        source: 'swiss_gemeinden',
        'source-layer': 'gdf_gemeinden', 
        type: 'fill',            // or line, symbol, circle, etc.
        paint: {
          'fill-color': 'steelblue',
          'fill-outline-color': 'white',
          'fill-opacity': 0.5
        }
      });
    });

})
</script>

<style scoped>

.map-container {
 width: 80%;
 height: 500px;
 margin-left: auto;
 margin-right: auto;
}

</style>