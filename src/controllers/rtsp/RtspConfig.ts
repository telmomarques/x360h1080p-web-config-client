import ConfigurableHack from "../ConfigurableHack";
import { HackId } from "../../helpers/HackId";

export class RtspConfigDefinition {
  enable!: boolean;
  encodingType!: string;
}

export default class RtspConfig extends ConfigurableHack<RtspConfigDefinition> {

  constructor() {
    super({
      hackId: HackId.RTSPServer, TCreator: RtspConfigDefinition
    });
  }

}
