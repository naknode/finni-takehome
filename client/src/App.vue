<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'

export default defineComponent({
  setup() {
    const route = useRoute()

    const layout = computed(() => {
      const layoutName = route.meta.layout || 'DefaultLayout'

      const layouts = {
        DefaultLayout,
        EmptyLayout
      }

      return layouts[layoutName] || DefaultLayout
    })

    return {
      layout
    }
  }
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
