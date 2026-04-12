import { Pool } from "pg";
import isLocal from "../utils/isLocal.js";

export default new Pool({
  connectionString: process.argv[2],
  ssl: isLocal() ? false : { rejectUnauthorized: false },
});
