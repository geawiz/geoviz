<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="10" md="10" no-gutters>
        <div id="map" class="map-container"></div>   
      </v-col>  
      <v-col cols="12" lg="2" md="2" no-gutters>
        <v-list
        lines="one"
        density="compact"
        v-model:selected="settingsSelection"
        select-strategy="leaf"
        class="mt-n4"
        >
        <v-list-subheader>Layers</v-list-subheader>
        <v-list-item
          v-for="(layer, i) in layers"
          :key="i"
          :title="getLayerScreenName(layer)"
          :value="layer"
          :append-icon="getLayerIcon(layer)"
        >
        <template v-slot:prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn :model-value="isSelected" color="blue"></v-checkbox-btn>
          </v-list-item-action>
        </template>
        </v-list-item>
      </v-list>
    </v-col> 
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import maplibregl from "maplibre-gl"
import { Protocol, PMTiles } from "pmtiles"
import { cogProtocol } from '@geomatico/maplibre-cog-protocol'
import "maplibre-gl/dist/maplibre-gl.css"

// we declare the maplibregl.Map object here, as in more complex components
// you may want to access the objects from other method
// than the onMounted
const mapGl = ref<maplibregl.Map|null>(null)

/// this variable will hold the currently selected layers in the list rendered on the right side of the map
const settingsSelection = ref<string[]>([])

// the layers we want to show
const layers = ['gdf_gemeinden', 'imageLayer']

// this watcher monitors any changes to the settingsSelection array
// when this array changes, it means that a new layer has either been selected or 
// removed. We therefore iterate through all the layers and set the visibility
// accordingly 
watch(settingsSelection, () => {
  layers.forEach(layerId => {
    const idx = settingsSelection.value?.findIndex((m) => m === layerId) ?? -1
    toggleLayerVisibility(layerId, idx >=0)
  })
})

onMounted(async () => {

  // add the pmtiles protocol
  const PMTILES_URL = "https://geovizbucket.s3.us-west-2.amazonaws.com/swiss_gemeinden.pmtiles"
  var p = addPMTilesProtocol(PMTILES_URL)
  
  // add the cog protocol
  maplibregl.addProtocol('cog', cogProtocol)

  // create the map object, bind it to the 'map' div in the template
  mapGl.value = new maplibregl.Map({
    container: "map",
    style: "https://geovizbucket.s3.us-west-2.amazonaws.com/osm_basempa_style.json"
  })

  // add controls
  mapGl.value?.addControl(new maplibregl.NavigationControl(), "top-right")

  // zoom center the map
  const header = await p.getHeader()
  mapGl.value?.setZoom(header.maxZoom - 3)
  mapGl.value?.setCenter([header.centerLon, header.centerLat])

  // populate the layer checkboxes
  layers.forEach(id => {
    settingsSelection.value?.push(id)
  })

  // add sources and layers
  addPmTilesSourceAndLayer(PMTILES_URL)
  addCogSourceAndLayer()
})

function addPMTilesProtocol(pmtiles_url: string)
{
  // create a protocol and a source(s) to it
  const protocol = new Protocol()
  // add PM Tiles protocol
  maplibregl.addProtocol("pmtiles", protocol.tile)
  const p = new PMTiles(pmtiles_url)
  protocol.add(p)
  return p
}

function addPmTilesSourceAndLayer(pmtiles_url: string)
{
  // add source
  const sourceId = "swiss_gemeinden"
  mapGl.value?.addSource(sourceId, {
    type: "vector",
    url: `pmtiles://${pmtiles_url}`
  })

  // add layer
  const layerId = "gdf_gemeinden"
  mapGl.value?.addLayer({
    id: layerId,
    source: sourceId,
    "source-layer": layerId,
    type: "fill",
    paint: {
      "fill-color": "blue",
      "fill-outline-color": "red",
      "fill-opacity": 0.3
    }
  })

  // set initial visibility
  toggleLayerVisibility(layerId, true)
}

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
  })

  // add layer
  const layerId = 'imageLayer'
  mapGl.value?.addLayer({
    id: layerId,
    source: sourceId,
    type: 'raster',
    paint: {
      'raster-opacity': 0.7
    }
  })

  // set initial visibility
  toggleLayerVisibility(layerId, true)
}

function toggleLayerVisibility(layerId: string, layerVisibility: boolean)
{
  if(mapGl.value && mapGl.value.getLayer(layerId))
  {
    const visibility = layerVisibility ? "visible" : "none"
    mapGl.value?.setLayoutProperty(layerId, "visibility", visibility)
  }
}

function getLayerScreenName(layerId: string)
{
  return layerId === "gdf_gemeinden" ? "PM Tiles" : "COG GEOTiff"
}

function getLayerIcon(layerId: string)
{
  const idx = settingsSelection.value?.findIndex((m) => m === layerId) ?? -1
  return idx >=0 ? 'mdi-layers' : 'mdi-layers-off'
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