import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const main = async () => {
  console.log("started");

  const orm = MikroORM.init({
    entities: [Post],
    dbName: "hermes",
    user: "fibarra",
    password: "fibarra",
    type: "postgresql",
    debug: !__prod__,
  });

  // const post = (await orm).em.create(Post, { title: "test post" });
};

main();
