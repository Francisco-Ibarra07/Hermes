import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";

const ormConfig = {
  entities: [Post],
  dbName: "hermes",
  user: "fibarra",
  password: "fibarra",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

export default ormConfig;
