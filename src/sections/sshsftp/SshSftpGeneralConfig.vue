<template>
  <div>
    <v-snackbar :top=true :timeout=10000 :color="snackbarColor" :vertical=true v-model="showSnackbar">
      <div class="font-weight-bold">General Configuration</div>
      <div>{{ snackbarText }}</div>
      <v-btn text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>

    <p class="grey--text lighten-3">General Configuration</p>

    <v-card :loading="isLoading" :disabled="isLoading">
      <v-card-text>
          <v-switch hide-details label="Enable SSH / SFTP" v-model="sshConfig.config.enable" class="mt-0"/>
      </v-card-text>

      <v-card-actions>
        <v-btn color="success" @click="saveConfig">Save</v-btn>
      </v-card-actions>

    </v-card>
    
  </div>
</template>

<script lang="ts">
import { HackId } from '../../helpers/HackId';
import { Vue, Component } from 'vue-property-decorator';
import SshGeneralConfig from '../../controllers/ssh/SshGeneralConfig';

@Component
export default class SshSftpGeneralConfig extends Vue {
  private hackId = [HackId.SSHServer];
  private isLoading = false;

  private sshConfig: SshGeneralConfig;

  private snackbarText: string;
  private showSnackbar: boolean;
  private snackbarColor: string;

  constructor() {
    super();

    this.snackbarText = "";
    this.showSnackbar = false;

    this.sshConfig = new SshGeneralConfig();

    this.snackbarColor = "";
  }

  mounted() {
    this.isLoading = true;

    this.sshConfig.loadConfig()
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
    this.isLoading = true;

    this.sshConfig.saveConfig()
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
