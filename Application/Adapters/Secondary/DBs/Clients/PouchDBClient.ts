import IClient from "../../IClient";
import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import config from "../../../../envconfig.json";

PouchDB.plugin(PouchDBFind);

class PouchDBClient implements IClient {
  private static instance: PouchDBClient;

  public db: any;
  private subscribers: any[] = [];

  private constructor() {
    // Do nothing
  }

  public static getInstance() {
    if (!PouchDBClient.instance) {
      PouchDBClient.instance = new PouchDBClient();
      if (!PouchDBClient.instance.db) {
        PouchDBClient.instance.db = new PouchDB(
          config.DATABASE.POUCHDB.DB_NAME
        );
      }
      PouchDBClient.instance.watchChanges();
    }
    return PouchDBClient.instance;
  }

  public async watchChanges() {
    const pouchDB = PouchDBClient.getInstance();
    const remoteDB = new PouchDB(config.DATABASE.POUCHDB.REMOTE.HOST, {
      auth: {
        username: config.DATABASE.POUCHDB.REMOTE.USERNAME,
        password: config.DATABASE.POUCHDB.REMOTE.PASSWORD,
      },
    });
    pouchDB.db
      .sync(remoteDB, {
        live: true,
      })
      .on("change", (change: any) => {
        if (change.direction == "pull") {
          pouchDB.subscribers.map((subscriber) => {
            subscriber(change);
          });
        }
      })
      .on("error", (err: any) => {
        console.log(err);
      });
  }

  public async subscribe(callback: any) {
    const pouchDB = PouchDBClient.getInstance();
    pouchDB.subscribers.push(callback);
  }

  public async unsubscribe(callback: any) {
    const pouchDB = PouchDBClient.getInstance();
    pouchDB.subscribers = pouchDB.subscribers.filter(
      (subscriber) => subscriber != callback
    );
  }
}

export default PouchDBClient.getInstance();
