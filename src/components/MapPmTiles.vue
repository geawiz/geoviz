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
  const PMTILES_URL = 'https://pmtiles.io/protomaps(vector)ODbL_firenze.pmtiles'
  const p = new PMTiles(PMTILES_URL)
  protocol.add(p)
  // grab the hader to later use zoom and centering values
  const header = await p.getHeader()
  // create the map obkect, bind it to the 'map' div in the template
  const map = new maplibregl.Map({
    container: 'map',
    zoom: header.maxZoom - 2,
    center: [header.centerLon, header.centerLat],
    style: {
      version: 8,
      sources: {
        'example_source': {
          type: 'vector',
          url: `pmtiles://${PMTILES_URL}`,
          attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
        }
      },
      // define the layers style
      layers: [
        {
          id: 'buildings',
          source: 'example_source',
          'source-layer': 'landuse',
          type: 'fill',
          paint: {
            'fill-color': 'steelblue'
          }
        },
        {
          id: 'roads',
          source: 'example_source',
          'source-layer': 'roads',
          type: 'line',
          paint: {
            'line-color': 'black'
          }
        },
        {
          id: 'mask',
          source: 'example_source',
          'source-layer': 'mask',
          type: 'fill',
          paint: {
            'fill-color': 'white'
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