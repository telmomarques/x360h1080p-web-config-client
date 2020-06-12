import ConfigurableHack from "../ConfigurableHack";
import { HackId } from "../../helpers/HackId";

export class WebsocketStreamConfigDefinition {
  enable!: boolean;
}

export default class WebsocketStreamConfig extends ConfigurableHack<WebsocketStreamConfigDefinition> {

  constructor() {
    super({
      hackId: HackId.WebsocketStreamServer,
      TCreator: WebsocketStreamConfigDefinition
    });
  }

}
