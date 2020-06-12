<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item-group color="primary">

          <v-list-item link :to="{name: 'Dashboard'}" exact>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>  

          <v-list-item link :to="{name: 'StreamingDashboard'}">
            <v-list-item-icon>
              <v-icon>mdi-video-wireless-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Video Streaming</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{name: 'SshSftpDashboard'}">
            <v-list-item-icon>
              <v-icon>mdi-console-network-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>SSH / SFTP Server</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title><slot name="toolbar-title" /></v-toolbar-title>
    </v-app-bar>

    <v-content>
        <slot name="content" />
    </v-content>
    
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class RootTemplate extends Vue {
  private drawer = true;
}
</script>