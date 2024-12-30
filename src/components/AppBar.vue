<template>
    <v-app-bar
      class="px-4 pb-2 pt-2"
      density="compact"
      flat
    >
    
      <v-avatar
        size="42"
        text="GV"
        variant="outlined">
      </v-avatar>

      <v-spacer></v-spacer>
      <v-btn icon href="https://github.com/janmanuelwinkler/geoviz" target="_blank">
        <v-avatar
        size="42"
        icon="mdi-github">
      </v-avatar>
      </v-btn>

      <v-switch
      class="mt-5 pl-3"
      v-model="themetoggle"
      false-icon="mdi-weather-sunny"
      true-icon="mdi-weather-night">
      </v-switch>

    </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const themetoggle = ref(false);
const theme = useTheme();

onMounted(() => {
  // try to detect from system preferences
  if (window.matchMedia)
  {
    themetoggle.value = 
      window.matchMedia('(prefers-color-scheme: dark)').matches ? false : true;
    

    // install listner for changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => 
    {
      themetoggle.value = event.matches ? false : true;
    });
  }
  
})

watchEffect(() => {
  theme.global.name.value = themetoggle.value ? 'light' : 'dark'
})
</script>
