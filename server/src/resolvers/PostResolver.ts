import { Post } from "../entities/Post";
import { Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
  @Query(() => [Post]) // Returns an array of post
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    const { em } = ctx;

    return em.find(Post, {});
  }
}
