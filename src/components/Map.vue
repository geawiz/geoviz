<template>
  <v-container fluid>
      <div :id="divId" class="map-container"></div>   
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { PropType } from 'vue'
import { Map } from '@/classes/tutorial.ts'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { v4 as uuid } from 'uuid';

const props = defineProps({
  map: Object as PropType<Map>
})

const mapGl = ref<maplibregl.Map|null>(null);

const divId = computed(() => {
  return "map_" + uuid()
})

const lng = computed(() => {
  const val =  props.map != undefined ? props.map.centerLng : 0
  return val??0
})

const lat = computed(() => {
  const val =  props.map != undefined ? props.map.centerLat : 0
  return val??0
})

onMounted(async () => {
  
  // create the map object, bind it to the 'map' div in the template
  mapGl.value = new maplibregl.Map({
    container: divId.value,
    style: props.map?.protocolData
  })

  // add controls
  mapGl.value?.addControl(new maplibregl.NavigationControl(), 'top-right')

  // center the map
  mapGl.value?.setZoom(props.map?.zoom ?? 1)
  mapGl.value?.setCenter([lng.value, lat.value])
})

</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>