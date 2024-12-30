<template>
  <v-app id="personal-page">
    <!-- APP BAR -->
    <AppBar class="themed-appbar"></AppBar>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-spacer></v-spacer>
          <!-- CENTRAL PANEL -->
          <v-col
            cols="12"
            no-gutters
          >
          <h1>GeoViz</h1>
          <h2>A collection of tutorials on how to display vector and raster Tiles on the web.</h2>
          
          <TutorialCard
          title="Display a simple map"
          subtitle="We are going to use vue-maplibre-gl to display a simple map."
          mapStyle="https://demotiles.maplibre.org/style.json"
          :mapCenterLng="8.52364435868436"
          :mapCenterLat="47.37771305255045"
          :mapZoom="6"
          ></TutorialCard>

          <TutorialPmTilesCard
          title="Display a PM tiles map"
          subtitle="We are going to use the native maplibre-gl to display a map from a PM Tiles."
          mapStyle="https://demotiles.maplibre.org/style.json"
          :mapCenterLng="8.52364435868436"
          :mapCenterLat="47.37771305255045"
          :mapZoom="6"
          ></TutorialPmTilesCard>
          
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-main>
    <!-- FOOTER -->
    <v-footer>
      <p class="footer-item">
        {{ currentYear }}. MIT License.
      </p>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MapPMTiles from './components/MapPmTiles.vue';

const currentYear = computed(() => {
  return (new Date()).getFullYear();
})

</script>

<style scoped>
.footer-item {
  font-size: smaller;
}
.footer-item a {
    color: rgba(var(--v-theme-on-surface) ,0.65);
}

.themed-appbar {
  background-color: rgba(var(--v-theme-background), 0.75);
}
</style>