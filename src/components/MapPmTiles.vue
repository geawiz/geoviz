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
    style: {
      version: 8,
      sources: {
        'example_source': {
          type: 'vector',
          url: `pmtiles://${PMTILES_URL}`,
        }
      },
      // define the layers style
      layers: [
        {
          id: 'gdf_gemeinden',
          source: 'example_source',
          'source-layer': 'gdf_gemeinden',
          type: 'fill',
          paint: {
            'fill-color': 'steelblue',
            'fill-outline-color': 'white'
          }
        }
      ]
    }
  })
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
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