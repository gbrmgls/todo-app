import IClient from "../../IClient";
import envconfig from "../../../../envconfig.json";

class DummyJSON implements IClient {
  private static instance: DummyJSON;

  private APIData: any = {
    host: envconfig.APIS.DUMMY_JSON.HOST,
  };

  private subscribers: any[] = [];

  private constructor() {
    // Do nothing
  }

  public static getInstance() {
    if (!DummyJSON.instance) {
      DummyJSON.instance = new DummyJSON();

      DummyJSON.instance.watchChanges();
    }
    return DummyJSON.instance;
  }

  public async watchChanges() {
    // const randomDataAPI = DummyJSON.getInstance();
    // On API change, notify subscribers
    // randomDataAPI.subscribers.map((subscriber) => {
    //   subscriber(change);
    // });
  }

  public async subscribe(callback: any) {
    const randomDataAPI = DummyJSON.getInstance();
    randomDataAPI.subscribers.push(callback);
  }

  public async unsubscribe(callback: any) {
    const randomDataAPI = DummyJSON.getInstance();
    randomDataAPI.subscribers = randomDataAPI.subscribers.filter(
      (subscriber) => subscriber != callback
    );
  }

  public getAPIData(): any {
    return this.APIData;
  }
}

export default DummyJSON.getInstance();
