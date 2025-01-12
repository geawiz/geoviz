<template>
  <v-container fluid>
    <v-card class="mx-auto" width="100%">
      <v-card-title>
        {{ tutorial?.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ tutorial?.subtitle }}
      </v-card-subtitle>
      <v-card-text>
        <Map
        :tutorial="tutorial"
        ></Map>
      </v-card-text>
    </v-card>
</v-container>  
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { Tutorial } from '@/classes/tutorial.ts'

const props = defineProps({
  tutorial: Object as PropType<Tutorial>
})

</script>

