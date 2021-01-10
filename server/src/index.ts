import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  console.log("started");

  const orm = MikroORM.init(mikroConfig);
  await (await orm).getMigrator().up();

  const post = (await orm).em.create(Post, { title: "test post" });
  await (await orm).em.persistAndFlush(post);
};

main();
