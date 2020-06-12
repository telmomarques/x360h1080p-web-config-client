<template>
<root-template>
    <template slot="toolbar-title">{{ toolbarTitle }}</template>

    <template slot="content">

      <v-container fluid>
        <v-row justify="center">

          <v-col cols="6" align-self="center">

            <v-row>
              <v-col>
                  <ssh-sftp-general-config />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <ssh-sftp-user-management />
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
import ServiceInfo from '../../components/ServiceInfo.vue';
import HackInfo from '../../components/HackInfo.vue';
import SshSftpGeneralConfig from './SshSftpGeneralConfig.vue';
import SshSftpUserManagement from './SshSftpUserManagement.vue';

@Component({
  components: {RootTemplate, SshSftpGeneralConfig, SshSftpUserManagement, ServiceInfo, HackInfo}
})
export default class SshSftpDashboard extends Vue {
  private toolbarTitle = "Video Streaming";
  private hackId = [HackId.SSHServer];
}
</script>
