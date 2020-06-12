import ConfigurableHack from "../ConfigurableHack";
import { HackId } from "../../helpers/HackId";

class SshUserConfigDefinition {
  public users!: SshUserDefinition[];
}

class SshUserDefinition {
  public systemUsername = "root";
  public username!: string;
  public password!: string;
}

export default class SshUserConfig extends ConfigurableHack<SshUserConfigDefinition, SshUserDefinition> {

  constructor() {
    super({
      hackId: HackId.SSHServer,
      endpointSuffix: "users",
      TCreator: SshUserConfigDefinition,
      ECreator: SshUserDefinition
    });
  }

}
