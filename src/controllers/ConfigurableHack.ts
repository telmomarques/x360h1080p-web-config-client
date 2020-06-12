import axios from "axios";

interface ConstructorOptions<T, E> {
  hackId: string;
  endpointSuffix?: string;
  TCreator: { new(): T};
  ECreator?: { new(): E};
}

export default class ConfigurableHack<T, E = void> {
  public config: T = {} as T;
  public entityConfig: E = {} as E;
  protected hackId: string;
  protected endpointSuffix: string;
  protected ECreator?: { new(): E };

  constructor(options: ConstructorOptions<T, E>) {
    this.hackId = options.hackId;
    this.endpointSuffix = options.endpointSuffix ?? "";

    if(options.TCreator) {
      this.config = new options.TCreator();
    }

    if(options.ECreator) {
      this.ECreator = options.ECreator;
      this.entityConfig = new options.ECreator();
    }
  }

  public loadConfig(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      axios.get<T>("/api/hack/" + this.hackId + "/config/" + this.endpointSuffix)
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
      axios.post("/api/hack/" + this.hackId + "/config/"+this.endpointSuffix, this.config)
      .then(() =>{ resolve() })
      .catch(() => { reject() });
    });
  }

  public addEntity(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios.post("/api/hack/" + this.hackId + "/config/"+this.endpointSuffix, this.entityConfig)
      .then(() => {
        if(this.ECreator) {
          this.entityConfig = new this.ECreator();
        }

        resolve();
      })
      .catch(error => { reject(error.response.data) });
    });
  }

  public deleteEntity(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios.delete("/api/hack/" + this.hackId + "/config/"+this.endpointSuffix+"/"+id, this.entityConfig)
      .then(() => { resolve() })
      .catch(() => { reject() });
    });
  }

}