import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Any, getConnection } from "typeorm";

@Resolver()
export class ChatResolver {
  // Get all chats from a user given a userId
  @UseMiddleware(isAuth)
  @Query(() => [Chat])
  async chats(@Ctx() ctx: MyContext): Promise<Chat[]> {
    const { req } = ctx;

    // Get user
    const targetUser = await User.findOne(req.session.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }
    console.log("target user: ", targetUser);

    // TODO: There's gotta be an easier way to do this (all queries below)
    // Hopefully i can get it down to just 1 query instead of 2 'join' queries

    // Get chatIds that 'targetUser' is apart of
    const chatList = await getConnection()
      .getRepository(Chat)
      .createQueryBuilder("chat")
      .select("chat.id")
      .leftJoin("chat.users", "user")
      .where(`user.id = ${targetUser.id}`)
      .getMany();

    const targetChatIds = chatList.map((chat) => chat.id);
    console.log("Chat ids: ", targetChatIds);

    // Return chats matching target 'chatIds'
    const chats = await Chat.find({ relations: ["users"], where: { id: Any(targetChatIds) } });

    console.log("response: ", chats);

    return chats;
  }

  // Create a chat given these userId's
  // @UseMiddleware(isAuth)
  @Mutation(() => Chat)
  async createChat(@Arg("userIds", () => [Number]) userIds: number[]): Promise<Chat> {
    console.log("Creating chat: ", userIds, "INDIVIDUAL");

    // Get users
    const users = await User.findByIds(userIds);
    if (users.length !== userIds.length) {
      throw new Error("Not all user ids were found");
    }
    console.log("Users found: ", users);

    // Create the chat
    const chat = await Chat.create({ chatType: "INDIVIDUAL", users, messages: [] }).save();
    console.log("New chat created: ", chat);

    return chat;
  }

  // Add a user to a chat given the userId
  // Add a message to the chat

  // Delete a person from a chat given their userId and chatId
  // Delete a chat given the chatId
  // Delete a message from the chat
}

/*


query {
  chats {
    id
    type
    createdAt
    updatedAt
    users {
      id
      email
    }
  }
}

mutation {
  createChat(userIds: ["1", "2"], type: "individual") {
    id
    type
    createdAt
    updatedAt
    users {
      id 
      email
    }
  }
}

*/
