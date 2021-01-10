import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { TestResolver } from "./resolvers/TestResolver";
import { PostResolver } from "./resolvers/PostResolver";

// Main function so I can do 'top-level' async/await
const main = async () => {
  console.log("started");

  const orm = MikroORM.init(mikroConfig);
  await (await orm).getMigrator().up();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  const schema = await buildSchema({
    resolvers: [TestResolver, PostResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    // Special object accessible by all resolvers
    context: async () => ({
      em: (await orm).em,
    }),
  });
  apolloServer.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log("Server listening on http://localhost:5000");
  });
};

main();
