import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  console.log("started");

  const orm = MikroORM.init(mikroConfig);
};

main();
