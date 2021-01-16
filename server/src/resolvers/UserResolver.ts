import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
import { genScreenName } from "../utils/uniqueName";

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
    const { req } = ctx;

    if (!req.session.userId) {
      return null;
    }

    return await User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async signupUser(
    @Arg("name", () => String) name: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const { req } = ctx;

    if (name.length === 0) {
      return {
        errors: [
          {
            field: "name",
            message: "name cannot be empty",
          },
        ],
      };
    }

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

    const userExists = await User.findOne({ where: { email } });
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

    const screenName = genScreenName();
    const hashedPassword = await argon2.hash(password);
    const newUser = await User.create({ email, name, password: hashedPassword, screenName }).save();

    req.session.userId = newUser.id;
    return { user: newUser };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const { req } = ctx;

    // If user DNE, return error
    const errMsg = "Email or Password is incorrect";
    const user = await User.findOne({ where: { email } });
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

  @Mutation(() => Boolean)
  logoutUser(@Ctx() ctx: MyContext) {
    const { req, res } = ctx;

    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          resolve(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        resolve(true);
      });
    });
  }
}
