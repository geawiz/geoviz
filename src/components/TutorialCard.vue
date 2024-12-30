<template>
  <v-container fluid>
    <v-card class="mx-auto">
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-subtitle>
        {{ subtitle }}
      </v-card-subtitle>
      <v-card-text>
        <Map
        :style="mapStyle"
        :Lng="mapCenterLng"
        :Lat="mapCenterLat"
        :zoom="mapZoom"
        ></Map>
      </v-card-text>
    </v-card>
</v-container>  
</template>

<script setup lang="ts">

const props = defineProps({
  title: String,
  subtitle: String,
  mapStyle: String,
  mapCenterLng: Number,
  mapCenterLat: Number,
  mapZoom: Number
})

</script>