import { Post } from "../entities/Post";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  // Returns an array of post
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  // Returns a single post given an id
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  // Creates a single post given the title
  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string): Promise<Post> {
    return Post.create({ title }).save();
  }

  // Updates a single post given id and title
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) newTitle: string
  ): Promise<Post | null> {
    // Make sure it exists
    const targetPost = await Post.findOne(id);
    if (!targetPost) {
      return null;
    }

    await Post.update({ id }, { title: newTitle });

    return targetPost;
  }

  // Deletes a single post given an id
  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
