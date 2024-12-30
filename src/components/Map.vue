<template>
  <v-container fluid>
  <mgl-map
    :map-style="style"
    :center="[Lng, Lat]"
    :zoom="zoom"
    height="500px"
  >
    <mgl-navigation-control />
  </mgl-map>
</v-container>  
</template>

<script setup lang="ts">
import {
  MglMap,
  MglNavigationControl,
} from '@indoorequal/vue-maplibre-gl';

const props = defineProps({
  style: String,
  Lng: Number,
  Lat: Number,
  zoom: Number
})
</script>

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>