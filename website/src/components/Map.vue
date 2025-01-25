<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="10" md="10" no-gutters>
        <div :id="divId" class="map-container"></div>   
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
          v-for="(map, i) in tutorial?.maps"
          :key="i"
          :title="getMapScreenName(map)"
          :value="getLayerId(map.layer)"
          :append-icon="getLayerIcon(map.layer)"
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
import type { PropType } from 'vue'
import { Tutorial, Map, Layer } from '@/classes/tutorial.ts'
import maplibregl from 'maplibre-gl'
import { Protocol, PMTiles } from 'pmtiles'
import { cogProtocol } from '@geomatico/maplibre-cog-protocol'
import { v4 as uuid } from 'uuid';
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps({
  tutorial: Object as PropType<Tutorial>
})

const settingsSelection = ref<string[]>([])
const mapGl = ref<maplibregl.Map|null>(null);

const divId = computed(() => {
  return "map_" + uuid()
})

watch(settingsSelection, () => {
  props.tutorial?.maps?.forEach(map => {
    const layerId = getLayerId(map.layer)
    const idx = settingsSelection.value?.findIndex((m) => m === layerId) ?? -1
    toggleLayerVisibility(layerId, idx >=0)
  });
})

onMounted(async () => {
  
  var p:PMTiles|undefined = undefined
  props.tutorial?.maps?.forEach(map => {
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
    style: props.tutorial?.basemap?.style
  })

  // add controls
  mapGl.value?.addControl(new maplibregl.NavigationControl(), 'top-right')

  // center the map
  mapGl.value?.setZoom(props.tutorial?.basemap?.zoom??0)
  mapGl.value?.setCenter([
    props.tutorial?.basemap?.centerLng??0, 
    props.tutorial?.basemap?.centerLat??0])

  if(p !== undefined)
  {
    const header = await p.getHeader()
    mapGl.value?.setZoom(header.maxZoom - 3)
    mapGl.value?.setCenter([header.centerLon, header.centerLat])
  }
  
  // populate the layer checkboxes
  props.tutorial?.maps?.forEach(map => {
    settingsSelection.value?.push(getLayerId(map.layer))
  });

  // add sources and layers based on protocol
  mapGl.value?.on('load', () => {
    props.tutorial?.maps.forEach(map => {
      if(map.protocol === "pmtiles")
      {
        addPmTilesSourceAndLayer(map)
      }
      else if(map.protocol === "cog")
      {
        addCogSourceAndLayer(map)
      }
    });
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

function addPmTilesSourceAndLayer(map:Map|undefined)
{
  // add source
  const sourceId = map?.source.name??""
  mapGl.value?.addSource(sourceId, {
    type: "vector",
    url: map?.source.url,
  });

  // add layer
  const layerId = map?.layer.id??""
  mapGl.value?.addLayer({
    id: layerId,
    source: sourceId,
    'source-layer': layerId,
    type: 'fill',
    paint: {
      'fill-color': map?.layer.paint?.fillColor,
      'fill-outline-color': map?.layer.paint?.fillOutlineColor,
      'fill-opacity': map?.layer.paint?.fillOpacity
    }
  });
  toggleLayerVisibility(layerId, true)
}

function addCogSourceAndLayer(map:Map|undefined)
{
  // add source
  const sourceId = map?.source.name??""
  mapGl.value?.addSource(sourceId, {
    type: 'raster',
    url: map?.source.url,
    tileSize: map?.source.tileSize,
    minzoom: map?.source.minzoom,
    maxzoom: map?.source.maxzoom
  });

  // add layer
  const layerId = map?.layer.id??""
  mapGl.value?.addLayer({
    id: layerId,
    source: sourceId,
    type: 'raster',
    paint: {
      "raster-opacity": map?.layer.paint?.rasterOpacity
    }
  });
  
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

function getLayerId(layer:Layer|undefined)
{
  return layer?.id??"undefined";
}

function getMapScreenName(map:Map|undefined)
{
  return map?.screenName??"undefined";
}

function getLayerIcon(layer:Layer|undefined)
{
  const layerId = getLayerId(layer)
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