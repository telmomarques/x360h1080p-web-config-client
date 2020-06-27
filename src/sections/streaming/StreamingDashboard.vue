<template>
<root-template>
    <template slot="toolbar-title">{{ toolbarTitle }}</template>

    <template slot="content">

      <v-container fluid>
        <v-row justify="center">

          <v-col cols="6" align-self="center">

            <v-row>
              <v-col>
                <streaming-config @saved="refresh" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <streaming-player ref="streamingPlayerComponent" />
              </v-col>
            </v-row>

            <v-row>	
              <v-col>	
                <hack-info class="fill-height" :hackIds="relatedHackIds" />	
              </v-col>	
            </v-row>
            
          </v-col>

        </v-row>
      </v-container>

    </template>
  </root-template>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { HackId } from '../../helpers/HackId';
import RootTemplate from '../root/RootTemplate.vue';
import HackInfo from '../../components/HackInfo.vue';
import StreamingPlayer from '../../components/StreamingPlayer.vue';
import StreamingConfig from './StreamingConfig.vue';

@Component({
  components: {RootTemplate, StreamingConfig, HackInfo, StreamingPlayer}
})
export default class StreamingDashboard extends Vue {
  private toolbarTitle = "Video Streaming";
  private relatedHackIds = [HackId.RTSPServer, HackId.WebsocketStreamServer];

  private refresh() {
    this.reloadPreview();
  }

  private reloadPreview() {
    window.setTimeout( () => {
      (this.$refs.streamingPlayerComponent as StreamingPlayer).reload();
    }, 1000);
  }
}
</script>
