<template>
  <div>
    <v-snackbar :top=true :timeout=10000 :color="snackbarColor" :vertical=true v-model="showSnackbar">
      <div class="font-weight-bold">Configuration</div>
      <div>{{ snackbarText }}</div>
      <v-btn text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>

    <v-card :loading="isLoading" :disabled="isLoading">
      <v-card-title>Configuration</v-card-title>

      <v-card-text>
        <v-form>
          <v-switch hide-details label="Enable RTSP" v-model="rtspConfig.config.enable" />
          <v-switch hide-details label="Enable Websocket Stream" v-model="websocketStreamConfig.config.enable" />
          
          <v-radio-group label="Encoding Type" v-model="rtspConfig.config.encodingType">
            <v-radio label="H265 (HEVC)" value="h265" />
            <v-radio label="H264" value="h264" />
          </v-radio-group>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="success" @click="saveConfig">Save</v-btn>
      </v-card-actions>    
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import RtspConfig from '../../controllers/rtsp/RtspConfig';
import WebsocketStreamConfig from '../../controllers/websocket-stream/WebsocketStreamConfig';

@Component
export default class StreamingConfig extends Vue {
  private isLoading = false;

  private rtspConfig: RtspConfig;
  private websocketStreamConfig: WebsocketStreamConfig;

  private snackbarText: string;
  private showSnackbar: boolean;
  private snackbarColor: string;

  constructor() {
    super();

    this.snackbarText = "";
    this.showSnackbar = false;

    this.rtspConfig = new RtspConfig();
    this.websocketStreamConfig = new WebsocketStreamConfig();

    this.snackbarColor = "";
  }

  mounted() {
    const rtspConfigResult = this.rtspConfig.loadConfig();
    const websocketConfigResult = this.websocketStreamConfig.loadConfig();

    this.isLoading = true;
    
    Promise.all([rtspConfigResult, websocketConfigResult])
    .then(() => {
      this.isLoading = false;
    })
    .catch(() => {
      this.snackbarText = "Error loading configuration.";
      this.snackbarColor = "error";
      this.showSnackbar = true;
    });
  }

  saveConfig(): void {
    const rtspSaveResult = this.rtspConfig.saveConfig();
    const websocketSaveResult = this.websocketStreamConfig.saveConfig();

    this.isLoading = true;

    Promise.all([rtspSaveResult, websocketSaveResult])
    .then(() => {
      this.isLoading = false;

      this.snackbarText = "Saved with success!";
      this.snackbarColor = "success";
      this.showSnackbar = true;

      this.$emit("saved");
    })
    .catch(() =>{
      this.snackbarText = "Error saving configuration.";
      this.snackbarColor = "error";
      this.showSnackbar = true;
    });

  }

}
</script>
