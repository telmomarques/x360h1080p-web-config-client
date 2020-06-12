import ConfigurableHack from "../ConfigurableHack";
import { HackId } from "../../helpers/HackId";

class SshGeneralConfigDefinition {
  public enable!: boolean;
}

export default class SshGeneralConfig extends ConfigurableHack<SshGeneralConfigDefinition> {

  constructor() {
    super({
      hackId: HackId.SSHServer,
      endpointSuffix: "general",
      TCreator: SshGeneralConfigDefinition,
    });
  }

}
