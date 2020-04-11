<template>
  <div>
    <v-snackbar :top=true :timeout=10000 :color=snackbarColor :vertical=true v-model="showSnackbar">
      <div class="font-weight-bold">Services</div>
      <div>{{ snackbarMessage }}</div>
      <v-btn text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>

    <v-card :loading="isLoading">
      <v-card-title>Services</v-card-title>

      <v-card-text>
        <div v-for="(status, hackId) in serviceStatus" :key="hackId">
          {{ status.name }}: <v-chip class="ma-2" small :color="status.color">{{ status.description }}</v-chip>
        </div>
      </v-card-text>
      <!--
      <v-card-actions>
        <v-spacer />
        <v-btn icon @click="refresh"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-card-actions>
      -->
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios, {AxiosResponse} from "axios";
import bluebird from "bluebird";

class ServiceStatus extends Vue {
  public name: string;
  public description: string;
  public color: string;

  constructor(name: string, description: string, color: string) {
    super();
    
    this.name = name;
    this.description = description;
    this.color = color;
  }
}

interface StatusPropertiesDefinition {
  description: string;
  color: string;
}

class ServiceStatusFactory {
  private static statusProperties: {[id: string]: StatusPropertiesDefinition} = {
    "run": {description: "Running", color: "success"},
    "down": {description: "Stopped", color: ""},
    "fail": {description: "Stopped", color: ""},
    "unknown": {description: "Unknown", color: "warning"}
  };

  public static make(name: string, status: string): ServiceStatus {
    const properties: StatusPropertiesDefinition = ServiceStatusFactory.statusProperties[status];
    return new ServiceStatus(name, properties.description, properties.color);
  }
}

@Component
export default class ServiceInfo extends Vue {

  @Prop({required: true})
  public hackIds!: string[];

  private serviceStatus: {[id: string]: ServiceStatus} = {};
  private isLoading = false;
  private showSnackbar = false;
  private snackbarMessage = "";
  private snackbarColor = "";

  constructor() {
    super();

    this.hackIds.forEach(hackId => this.serviceStatus[hackId] = ServiceStatusFactory.make(hackId, "unknown"));
  }

  public refresh() {
    const responses: Map<string, Promise<AxiosResponse>> = new Map();
    this.isLoading = true;

    this.hackIds.forEach(hackId =>{
      responses.set(hackId, axios.get("/api/hack/" + hackId + "/service"));
    });
    
    bluebird.props(responses)
      .then(result => {
        for(const [hackId, response] of result.entries()) {
          this.serviceStatus[hackId] = ServiceStatusFactory.make(response.data.name, response.data.status);
        }
        
        this.isLoading = false;
      })
      .catch(() => {
        this.snackbarMessage = "An error occured while trying to fetch service status.";
        this.snackbarColor = "error";
        this.showSnackbar = true;
      });
  }

  mounted() {
    this.refresh();
  }
}
</script>
