<template>
  <v-card :loading="isLoading">
    <v-card-title>Info</v-card-title>

    <v-card-text v-html="infoText" />
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios from "axios";

@Component
export default class HackInfo extends Vue {
  @Prop({required: true})
  public hackIds!: string[];

  private isLoading: boolean;
  private infoText: string;

  constructor() {
    super();

    this.isLoading = false;
    this.infoText = "";
  }

  mounted() {
    this.hackIds.forEach(hackId => {
      axios.get("/api/hack/" + hackId + "/info")
      .then(response => {
        this.infoText += response.data;
      });
    });
  }

}
</script>
