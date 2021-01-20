import "reflect-metadata";
import { COOKIE_NAME, PORT, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Chat } from "./entities/Chat";
import { Message } from "./entities/Message";
import { ChatResolver } from "./resolvers/ChatResolver";
import { createServer } from "http";

// Main function so I can do 'top-level' async/await
const main = async () => {
  // Typeorm
  await createConnection({
    type: "postgres",
    database: "hermes",
    username: "fibarra",
    password: "fibarra",
    logging: false,
    synchronize: !__prod__,
    entities: [User, Chat, Message],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // CORS
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // express-sessions
  app.use(
    session({
      name: COOKIE_NAME,
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

  // Type-graphql
  const schema = await buildSchema({
    resolvers: [UserResolver, ChatResolver],
    validate: false,
  });

  // Apollo server
  const apolloServer = new ApolloServer({
    schema,
    // Special object accessible by all resolvers
    context: async ({ req, res }): Promise<MyContext> => ({
      req,
      res,
    }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  // Subscriptions setup
  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
    );
  });
};

main();
