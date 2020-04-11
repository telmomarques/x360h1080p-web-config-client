<template>
<root-template>
    <div slot="toolbar-title">{{ toolbarTitle }}</div>
    <div slot="content">
      <v-container>
        <p>The dashboard is currently empty.</p>
        <p>Use the menu on the left to do things.</p>
      </v-container>
    </div>
  </root-template>
</template>

<script>
import RootTemplate from '../root/RootTemplate.vue'

export default {
  name: 'Dashboard',
  data: () => ({
      toolbarTitle: "Xiaomi Hacks"
  }),
  components: {
    RootTemplate
  }
}
</script>
