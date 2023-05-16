import IClient from "../../IClient";
import envconfig from "../../../../envconfig.json";

class Randommer implements IClient {
  private static instance: Randommer;

  private APIData: any = {
    host: envconfig.APIS.RANDOMMER.HOST,
    apiKey: envconfig.APIS.RANDOMMER.API_KEY,
  };

  private subscribers: any[] = [];

  private constructor() {
    // Do nothing
  }

  public static getInstance() {
    if (!Randommer.instance) {
      Randommer.instance = new Randommer();

      Randommer.instance.watchChanges();
    }
    return Randommer.instance;
  }

  public async watchChanges() {
    // const randomDataAPI = Randommer.getInstance();
    // On API change, notify subscribers
    // randomDataAPI.subscribers.map((subscriber) => {
    //   subscriber(change);
    // });
  }

  public async subscribe(callback: any) {
    const randomDataAPI = Randommer.getInstance();
    randomDataAPI.subscribers.push(callback);
  }

  public async unsubscribe(callback: any) {
    const randomDataAPI = Randommer.getInstance();
    randomDataAPI.subscribers = randomDataAPI.subscribers.filter(
      (subscriber) => subscriber != callback
    );
  }

  public getAPIData(): any {
    return this.APIData;
  }
}

export default Randommer.getInstance();
