<template>
  <v-container fluid>
  <mgl-map
    :map-style="map?.protocolData"
    :center="[lng??0, lat??0]"
    :zoom="map?.zoom"
    height="500px"
  >
    <mgl-navigation-control />
  </mgl-map>
</v-container>  
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import {
  MglMap,
  MglNavigationControl,
} from '@indoorequal/vue-maplibre-gl';
import { Map } from '@/classes/tutorial.ts'

const props = defineProps({
  map: Object as PropType<Map>
})

const lng = computed(() => {
  const val =  props.map != undefined ? props.map.centerLng : 0
  return val
})

const lat = computed(() => {
  return props.map != undefined ? props.map.centerLat : 0
})

</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>