<template>
  <div>
    <v-snackbar
      :top="true"
      :timeout="10000"
      :color="snackbarColor"
      :vertical="true"
      v-model="showSnackbar">
      <div class="font-weight-bold">User Management</div>
      <div>{{ snackbarText }}</div>
      <v-btn text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>

    <p class="grey--text lighten-3">User Management</p>

    <v-data-table
      :headers="userTableHeaders"
      :items="sshUserConfig.config.users"
      :disable-pagination="true"
      :loading="isLoading"
      hide-default-footer
      no-data-text="Nothing here, create a user to get started!"
      class="elevation-1 mt-5">

      <template v-slot:top>
        <v-toolbar flat dense>
          <v-spacer></v-spacer>

          <v-dialog width="500" v-model="showNewUserDialog" >
            <template v-slot:activator="{ on }">
              <v-btn color="primary" small v-on="on" :disabled="isLoading">New User</v-btn>
            </template>

            <v-card :loading="isSaving">
              <v-card-title>New User</v-card-title>

              <v-card-text>
                  <v-text-field label="System Username" class="d-none" v-model="sshUserConfig.entityConfig.systemUsername" />
                  <v-text-field autofocus label="Username" v-model="sshUserConfig.entityConfig.username" :disabled="isSaving" />
                  <v-text-field label="Password" type="password" v-model="sshUserConfig.entityConfig.password" :disabled="isSaving" />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn text @click="showNewUserDialog = false" :disabled="isSaving">Close</v-btn>
                <v-btn color="success" @click="addUser" :disabled="isSaving">Create</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon @click="deleteUser(item.username)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { HackId } from "../../helpers/HackId";
import { Vue, Component } from "vue-property-decorator";
import SshUserConfig from "../../controllers/ssh/SshUserConfig";

@Component
export default class SshSftpUserManagement extends Vue {
  private hackId = [HackId.SSHServer];
  private isLoading = false;
  private isSaving = false;

  private sshUserConfig: SshUserConfig;

  private snackbarText: string;
  private showSnackbar: boolean;
  private snackbarColor: string;

  private showNewUserDialog: boolean;

  private userTableHeaders = [
    { text: "Username", value: "username", sortable: false },
    { text: "Actions", value: "actions", sortable: false }
  ];

  private users = [];

  constructor() {
    super();

    this.snackbarText = "";
    this.showSnackbar = false;

    this.showNewUserDialog = false;

    this.sshUserConfig = new SshUserConfig();

    this.snackbarColor = "";
  }

  mounted() {
    this.loadConfig();
  }

  loadConfig() {
    this.isLoading = true;
    
    this.sshUserConfig.loadConfig()
    .then(() => {
      this.isLoading = false;
    })
    .catch(() => {
      this.snackbarText = "Error loading configuration.";
      this.snackbarColor = "error";
      this.showSnackbar = true;
    });
  }

  addUser(): void {
    this.isSaving = true;

    this.sshUserConfig.addEntity()
    .then(() => {
      this.isSaving = false;

      this.snackbarText = "User created with success!";
      this.snackbarColor = "success";
      this.showSnackbar = true;
      this.showNewUserDialog = false;

      this.$emit("saved");

      this.loadConfig();
    })
    .catch(error => {
      this.isSaving = false;

      this.snackbarText = error.message;
      this.snackbarColor = "error";
      this.showSnackbar = true;
    });
  }

  deleteUser(username: string) {
    this.isLoading = true;

    this.sshUserConfig.deleteEntity(username)
    .then(() => {
      this.isLoading = false;

      this.snackbarText = "User deleted with success!";
      this.snackbarColor = "success";
      this.showSnackbar = true;
      this.showNewUserDialog = false;

      this.$emit("saved");

      this.loadConfig();
    })
    .catch(() => {
      this.snackbarText = "Error deleting user.";
      this.snackbarColor = "error";
      this.showSnackbar = true;
    });
  }
}
</script>
