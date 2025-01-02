<template>
  <v-container fluid>
    <v-card class="mx-auto" width="100%">
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-subtitle>
        {{ subtitle }}
      </v-card-subtitle>
      <v-card-text>
        <MapPmTiles/>
      </v-card-text>
    </v-card>
</v-container>  
</template>

<script setup lang="ts">

const props = defineProps({
  title: String,
  subtitle: String
})

</script>