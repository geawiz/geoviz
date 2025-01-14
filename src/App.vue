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
          
          <div v-for="(tutorial, i) in tutorials" :key="i">
            <TutorialCard
              :tutorial="tutorial"
            ></TutorialCard>
          </div>
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
import { Tutorials } from '@/classes/tutorial.ts'
import jsonTutorials from '@/assets/tutorials.json'

const currentYear = computed(() => {
  return (new Date()).getFullYear();
})

const tutorials = computed(() => {
  var jsonString = JSON.stringify(jsonTutorials);
  var tut:Tutorials = JSON.parse(jsonString);
  return tut;
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