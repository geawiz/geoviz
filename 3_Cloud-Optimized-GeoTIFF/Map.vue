<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" no-gutters>
        <div id="map" class="map-container"></div>   
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import { onMounted, ref } from "vue"
import maplibregl from "maplibre-gl"
import { cogProtocol } from '@geomatico/maplibre-cog-protocol'
import "maplibre-gl/dist/maplibre-gl.css"

// we declare the maplibregl.Map object here, as in more complex components
// you may want to access the objects from other method
// than the onMounted
const mapGl = ref<maplibregl.Map|null>(null);

onMounted(async () => {

  // add the pmtiles protocol
  maplibregl.addProtocol('cog', cogProtocol)

  // create the map object, bind it to the 'map' div in the template
  mapGl.value = new maplibregl.Map({
    container: "map",
    style: "https://geovizbucket.s3.us-west-2.amazonaws.com/osm_basempa_style.json"
  })

  // add controls
  mapGl.value?.addControl(new maplibregl.NavigationControl(), "top-right")

  // zoom center the map
  mapGl.value?.setZoom(12)
  mapGl.value?.setCenter([8.542810246023732, 47.371741515957304])

  // add sources and layers
  addCogSourceAndLayer()
})

function addCogSourceAndLayer()
{
  // add source
  const sourceId = 'imageSource'
  mapGl.value?.addSource(sourceId, {
    type: 'raster',
    url: 'cog://https://geovizbucket.s3.us-west-2.amazonaws.com/output_cog_small_jpeg.tif',
    tileSize: 512,
    minzoom: 5,
    maxzoom: 20
  });

  // add layer
  const layerId = 'imageLayer'
  mapGl.value?.addLayer({
    id: layerId,
    source: sourceId,
    type: 'raster',
    paint: {
      'raster-opacity': 0.7
    }
  });
}
</script>

<style scoped>

.map-container {
  width: 100%;
  height: 500px;
  margin-left: auto;
  margin-right: auto;
}

</style>