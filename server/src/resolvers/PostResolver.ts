import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
  // Returns an array of post
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    const { em } = ctx;

    return em.find(Post, {});
  }

  // Returns a single post given an id
  // Returns 'null' if not found
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext): Promise<Post | null> {
    const { em } = ctx;

    // Find post where id='{id}'
    return em.findOne(Post, { id });
  }

  // Creates a single post given the title
  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    const { em } = ctx;

    // Create new post with title passed in
    const newPost = em.create(Post, { title });
    await em.persistAndFlush(newPost);
    return newPost;
  }

  // Updates a single post given id and title
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) newTitle: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const { em } = ctx;

    // Make sure it exists
    const targetPost = await em.findOne(Post, { id });
    if (!targetPost) {
      return null;
    }

    // Use em to update on postgres
    targetPost.title = newTitle;
    await em.persistAndFlush(targetPost);

    return targetPost;
  }

  // Deletes a single post given an id
  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext): Promise<boolean> {
    const { em } = ctx;

    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch {
      return false;
    }
  }
}
