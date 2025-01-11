<template>
  <v-container fluid>
    <div :id="divId" class="map-container"></div>      
      <v-list
      v-model:selected="settingsSelection"
      select-strategy="leaf"
      >
      <v-list-subheader>Layers</v-list-subheader>
      <v-list-item
        v-for="(map, i) in maps"
        :key="i"
        :title="getLayerId(map.layer)"
        :value="getLayerId(map.layer)"
      >
      <template v-slot:prepend="{ isSelected }">
        <v-list-item-action start>
          <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
        </v-list-item-action>
      </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import { Map, Layer } from '@/classes/tutorial.ts'
import maplibregl from 'maplibre-gl'
import { Protocol, PMTiles } from 'pmtiles'
import { cogProtocol } from '@geomatico/maplibre-cog-protocol'
import 'maplibre-gl/dist/maplibre-gl.css'
import { v4 as uuid } from 'uuid';

const props = defineProps({
  maps: Object as PropType<Map[]>
})

const settingsSelection = ref<string[]>([])
const mapGl = ref<maplibregl.Map|null>(null);

const divId = computed(() => {
  return "map_" + uuid()
})

watch(settingsSelection, () => {
  props.maps?.forEach(map => {
    const layerId = getLayerId(map.layer)
    const idx = settingsSelection.value?.findIndex((m) => m === layerId) ?? -1
    toggleLayerVisibility(layerId, idx >=0)
  });
})

onMounted(async () => {
  
  
  const PMTILES_URL = 'https://geovizbucket.s3.us-west-2.amazonaws.com/swiss_gemeinden.pmtiles'
  var p:PMTiles|undefined = undefined
  props.maps?.forEach(map => {
    if(map.protocol==="pmtiles")
    {
      p = addPMTilesProtocol(map)
    }
    else if(map.protocol==="cog")
    {
      // add COG protocol
      maplibregl.addProtocol('cog', cogProtocol)
    }
  });

  // create the map object, bind it to the 'map' div in the template
  mapGl.value = new maplibregl.Map({
    container: divId.value,
    style: "https://demotiles.maplibre.org/style.json"
  })

  // add controls
  mapGl.value?.addControl(new maplibregl.NavigationControl(), 'top-right')

  // center the map
  if(p !== undefined)
  {
    const header = await p.getHeader()
    mapGl.value?.setZoom(header.maxZoom - 3)
    mapGl.value?.setCenter([header.centerLon, header.centerLat])
  }

  // populate the layer checkboxes
  props.maps?.forEach(map => {
    settingsSelection.value?.push(getLayerId(map.layer))
  });

  // add sources and layers
  //TODO: make this parametrize on the map object
  mapGl.value?.on('load', () => {

    mapGl.value?.addSource('swiss_gemeinden', {
      type: 'vector',
      url: `pmtiles://${PMTILES_URL}`,
    });

    mapGl.value?.addLayer({
      id: 'gdf_gemeinden',
      source: 'swiss_gemeinden',
      'source-layer': 'gdf_gemeinden',
      type: 'fill',            // or line, symbol, circle, etc.
      paint: {
        'fill-color': 'steelblue',
        'fill-outline-color': 'white',
        'fill-opacity': 0.3
      }
    });
    toggleLayerVisibility("gdf_gemeinden", true)

    mapGl.value?.addSource('imageSource', {
      type: 'raster',
      url: 'cog://https://geovizbucket.s3.us-west-2.amazonaws.com/output_cog_small_jpeg.tif',
      tileSize: 512,
      minzoom: 5,
      maxzoom: 20
    });

    mapGl.value?.addLayer({
      id: 'imageLayer',
      source: 'imageSource',
      type: 'raster'
    });
    toggleLayerVisibility("imageLayer", true)

  });
})

function addPMTilesProtocol(map:Map|undefined)
{
  // create a protocol and a source(s) to it
  const protocol = new Protocol()
  // add PM Tiles protocol
  maplibregl.addProtocol('pmtiles', protocol.tile)
  const PMTILES_URL = map?.protocolData??""
  const p = new PMTiles(PMTILES_URL)
  protocol.add(p)
  return p
}

function toggleLayerVisibility(layerId: string, layerVisibility: boolean)
{
  if(mapGl.value && mapGl.value.getLayer(layerId))
  {
    const visibility = layerVisibility ? "visible" : "none"
    mapGl.value?.setLayoutProperty(layerId, "visibility", visibility)
  }
}

function getLayerId(layer:Layer|undefined)
{
  return layer?.id??"undefined";
}

</script>

<style scoped>
.map-container {
  width: 80%;
  height: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>