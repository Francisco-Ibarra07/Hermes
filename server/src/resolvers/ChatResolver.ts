import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Any, getConnection, In } from "typeorm";

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

    // Return chats matching target 'chatIds'
    let chats = await Chat.find({
      relations: ["users"],
      where: { id: Any(targetChatIds) },
      order: { updatedAt: "DESC" },
    });

    // Workaround to remove targetUser from list
    chats = chats.map((chat) => {
      chat.users = chat.users.filter((user) => user.id !== targetUser.id);
      return chat;
    });

    return chats;
  }

  @UseMiddleware(isAuth)
  @Query(() => [Message])
  async getMessages(@Arg("chatId", () => Number) chatId: number) {
    const chat = await Chat.findOne(chatId, { relations: ["messages"] });
    if (!chat) {
      throw new Error("Chat does not exist. chatId: " + chatId);
    }

    return chat.messages;
  }

  // Create a chat given list of screen names
  @UseMiddleware(isAuth)
  @Mutation(() => Chat)
  async createChat(@Arg("screenNames", () => [String]) screenNames: string[]): Promise<Chat> {
    // Get users
    const users = await User.find({ where: { screenName: In(screenNames) } });
    if (users.length !== screenNames.length) {
      throw new Error("Not all user ids were found");
    }

    // Create the chat
    const chat = await Chat.create({ chatType: "", users, messages: [] }).save();

    return chat;
  }

  // Add a message to the chat
  @UseMiddleware(isAuth)
  @Mutation(() => Message)
  async createMessage(
    @Arg("chatId", () => Number) chatId: number,
    @Arg("messageType", () => String) messageType: string,
    @Arg("content", () => String) content: string
  ): Promise<Message> {
    const chat = await Chat.findOne(chatId);
    if (!chat) {
      throw new Error("Chat does not exist. chatId: " + chatId);
    }

    const newMessage = await Message.create({ chatId, chat, messageType, content }).save();

    chat.updatedAt = new Date();
    await chat.save();

    return newMessage;
  }

  // Add a user to a chat given the userId

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
