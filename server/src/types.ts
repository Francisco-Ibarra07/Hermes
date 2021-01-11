import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};

// Below is to allow 'req.session' to have a 'userId'
// field. Solution found from:
// https://github.com/expressjs/session/issues/792
declare module "express-session" {
  interface Session {
    userId: number;
  }
}
