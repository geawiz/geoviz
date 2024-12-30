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
          <h2>This is a barebone, placeholder page that will soon change.</h2>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-main>
    <!-- FOOTER -->
    <v-footer>
      <p class="footer-item">
        {{ currentYear }}. 
        Some footer info.
      </p>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// the following variables are read from static json. 
// in a non-static website, these would be returned by some sort of backedn

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