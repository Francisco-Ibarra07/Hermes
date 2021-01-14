import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { TestResolver } from "./resolvers/TestResolver";
import { PostResolver } from "./resolvers/PostResolver";
import { UserResolver } from "./resolvers/UserResolver";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

// Main function so I can do 'top-level' async/await
const main = async () => {
  console.log("started");

  await createConnection({
    type: "postgres",
    database: "hermes2",
    username: "fibarra",
    password: "fibarra",
    logging: !__prod__,
    synchronize: !__prod__,
    entities: [Post, User],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      secret: "tempsecretkey",
      resave: false,
      saveUninitialized: false,
    })
  );

  const schema = await buildSchema({
    resolvers: [TestResolver, PostResolver, UserResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    // Special object accessible by all resolvers
    context: async ({ req, res }): Promise<MyContext> => ({
      req,
      res,
    }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(5000, () => {
    console.log("Server listening on http://localhost:5000");
  });
};

main();
