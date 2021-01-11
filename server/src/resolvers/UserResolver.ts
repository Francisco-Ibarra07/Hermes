import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async registerUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<User> {
    const { em } = ctx;
    const hashedPassword = await argon2.hash(password);

    const newUser = em.create(User, { email, password: hashedPassword });
    await em.persistAndFlush(newUser);

    return newUser;
  }
}
