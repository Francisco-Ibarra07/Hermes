import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
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
  @Query(() => User, { nullable: true })
  async isLoggedIn(@Ctx() ctx: MyContext) {
    const { em, req } = ctx;

    if (!req.session.userId) {
      return null;
    }

    return await em.findOne(User, { id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async signupUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const { em, req } = ctx;

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

    req.session.userId = newUser.id;
    return { user: newUser };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const { em, req } = ctx;

    // If user DNE, return error
    const errMsg = "Email or Password is incorrect";
    const user = await em.findOne(User, { email: email.toLowerCase() });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: errMsg,
          },
          {
            field: "password",
            message: errMsg,
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
            field: "email",
            message: errMsg,
          },
          {
            field: "password",
            message: errMsg,
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
}
