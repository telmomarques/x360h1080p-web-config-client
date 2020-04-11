import axios from "axios";

export default abstract class ConfigurableHack<T> {
    public config: T = {} as T;
    protected hackId = "";

    constructor(hackId: string) {
        this.hackId = hackId;
    }

    public loadConfig(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        axios.get<T>("/api/hack/" + this.hackId + "/config")
        .then(response =>
        {
          this.config = response.data;
          resolve();
        })
        .catch(() => { reject() });
      });
    }
    
    public saveConfig(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
          axios.post("/api/hack/" + this.hackId + "/config", this.config)
          .then(() =>{ resolve() })
          .catch(() => { reject() });
      });
  }

}