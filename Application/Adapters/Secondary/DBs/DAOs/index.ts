import * as PouchDB from "./PouchDB/";
import config from "../../../../envconfig.json";

const DAOs: any = {
  POUCHDB: PouchDB,
};

// Selects the correct DAO type depending on the selected database type from envconfig.json
export default DAOs[config.DATABASE.DB_TYPE];
