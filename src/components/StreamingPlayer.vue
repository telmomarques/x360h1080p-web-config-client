<template>
  <div>
    <v-snackbar :top=true :timeout=10000 :color="snackbarColor" :vertical=true v-model="showSnackbar">
      <div class="font-weight-bold">Preview Player</div>
      <div>{{ snackbarText }}</div>
      <v-btn text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>

    <v-card :loading="isLoading">
      <v-card-title>Preview</v-card-title>

      <v-card-text>
        <video id="videoPreview" ref="videoPreview" controls autoplay muted style="width: 100%; height: 250px;"></video>
        <v-overlay :opacity="overlayOpacity" :absolute="true" :value="isLoading || showOverlay">
          
          <v-progress-circular v-if="isLoading" indeterminate color="secondary"/>

          <v-container v-if="showOverlay">
            <v-row>
              <v-col class="text-center">
                <v-icon size="70">mdi-video-off</v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                {{ overlayMessage }}
              </v-col>
            </v-row>
          </v-container>

        </v-overlay>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn-toggle rounded color="primary" background-color="secondary" v-model="videoChannel" @change="reload">
          <v-btn :disabled="isLoading" small :value=0><span>Mainstream</span></v-btn>
          <v-btn :disabled="isLoading" small :value=1><span>Substream</span></v-btn>
        </v-btn-toggle>
        
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from "axios";
import { HackId } from '../helpers/HackId';

// eslint-disable-next-line
const Wfs: any = require("@/assets/js/wfs");
//import * as Wfs from "@/assets/js/wfs";

@Component
export default class StreamingPlayer extends Vue {

  private isLoading: boolean;
  private videoChannel: number;
  private mainstreamUri: string;
  private substreamUri: string;

  private snackbarColor: string;
  private showSnackbar: boolean;
  private snackbarText: string;

  private showOverlay: boolean;
  private overlayOpacity: number;
  private overlayMessage: string;

  private websocket!: WebSocket;

  constructor() {
    super();

    this.isLoading = false;

    this.videoChannel = 1;

    this.mainstreamUri = "";
    this.substreamUri = "";

    this.snackbarColor = "";
    this.showSnackbar = false;
    this.snackbarText = "";

    this.showOverlay = false;
    this.overlayOpacity = 0.46;
    this.overlayMessage = "";
  }

  public reload(): void {
    this.isLoading = true;

    this.isWebsocketStreamEnabled().then(websocketStreamEnabled => {
      if(websocketStreamEnabled) {
        this.getCurrentVideoEncoding().then(videoEncoding => {
          if(videoEncoding === "h264") {

            this.loadWebsocketStreamEndpoints().then(endpoints => {    
              this.mainstreamUri = endpoints.mainstream;
              this.substreamUri = endpoints.substream;
              this.isLoading = false;
              this.showOverlay = false;
              this.overlayOpacity = 0.46;
              this.overlayMessage = "";

              this.reloadPlayer();  
            });
          }
          else {
            this.isLoading = false;

            this.showOverlay = true;
            this.overlayOpacity = 1;
            this.overlayMessage = "Preview requires H264 encoding.";
          }
        });
      }
      else {
        this.isLoading = false;

        this.showOverlay = true;
        this.overlayOpacity = 1;
        this.overlayMessage = "Preview requires \"Websocket Stream\" to be enabled.";
      }
    });
  }

  private reloadPlayer(): void {
    if(this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.close();
    }

    this.$nextTick(() => {
      const videoElement: HTMLVideoElement = this.$refs.videoPreview as HTMLVideoElement;

      if(Wfs.isSupported()) {
        const wfs = new Wfs({fps:30});
        this.websocket = new WebSocket(this.videoChannel === 0 ? this.mainstreamUri : this.substreamUri);

        wfs.attachMedia(videoElement,'H264Raw');

        videoElement.addEventListener("pause", function() {
          wfs.config.paused = true;
        }, true);

        videoElement.addEventListener("play", function() {
          wfs.config.paused = false;
        }, true);

        this.websocket.onopen = function() {
          this.binaryType = 'arraybuffer';
        }

        this.websocket.onmessage = function(e) {
          wfs.receiveSocketMessage(e.data);
        }
      }
    });
  }

  mounted() {
      this.reload();
  }

  private isWebsocketStreamEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
       axios.get("/api/hack/" + HackId.WebsocketStreamServer + "/config")
      .then(response => {
        resolve(response.data.enable);
      })
      .catch(() => {
        this.showSnackbarError("Error loading metadata.");
      });
    });
  }

  private getCurrentVideoEncoding(): Promise<string> {
    return new Promise((resolve => {
      axios.get("/api/hack/" + HackId.RTSPServer + "/config")
      .then(response => {
        resolve(response.data.encodingType);
      })
      .catch(() => {
        this.showSnackbarError("Error loading metadata.");
      });
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private loadWebsocketStreamEndpoints(): Promise<any> {
    return new Promise((resolve) => {
      axios.get("/api/hack/" + HackId.WebsocketStreamServer + "/endpoints")
      .then(response => {
        resolve(response.data);
      })
      .catch(() => {
        this.showSnackbarError("Error loading metadata.");
      });
    });
  }

  private showSnackbarError(message: string) {
    this.snackbarColor = "error";
    this.snackbarText = message;
    this.showSnackbar = true;
  }

}
</script>
