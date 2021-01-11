import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async signupUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const { em } = ctx;

    if (password.length < 6) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be at least 6 characters",
          },
        ],
      };
    }

    const userExists = await em.findOne(User, { email });
    if (userExists) {
      return {
        errors: [
          {
            field: "email",
            message: "email already exists",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = em.create(User, { email: email.toLowerCase(), password: hashedPassword });
    await em.persistAndFlush(newUser);

    return { user: newUser };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const { em } = ctx;

    // If user DNE, return error
    const user = await em.findOne(User, { email: email.toLowerCase() });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "Invalid login",
          },
        ],
      };
    }

    // If invalid password, return error
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid login",
          },
        ],
      };
    }

    return {
      user,
    };
  }
}
