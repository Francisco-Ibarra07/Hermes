import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import { Any, getConnection, In } from "typeorm";

@ObjectType()
class NewMessagePayload {
  @Field()
  newMessage: Message;
}

@ObjectType()
class NewMessageArgs {
  @Field()
  userId: number;
}

@ObjectType()
class FilterOptions {
  @Field()
  payload: NewMessagePayload;
  @Field()
  args: NewMessageArgs;
}

const PUBSUB_NEW_MESSAGE = "PUBSUB_NEW_MESSAGE";

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
    const messages = await Message.find({
      relations: ["chat"],
      where: { chatId },
      order: { updatedAt: "DESC" },
    });

    return messages;
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
    @Arg("content", () => String) content: string,
    @Ctx() ctx: MyContext,
    @PubSub(PUBSUB_NEW_MESSAGE) publish: Publisher<NewMessagePayload>
  ): Promise<Message> {
    const { req } = ctx;
    const senderId = req.session.userId;

    const chat = await Chat.findOne(chatId, { relations: ["users"] });
    if (!chat) {
      throw new Error("Chat does not exist. chatId: " + chatId);
    }

    const newMessage = await Message.create({
      senderId,
      chatId,
      chat,
      messageType,
      content,
    }).save();

    chat.updatedAt = new Date();
    await chat.save();

    await publish({ newMessage });

    return newMessage;
  }

  @Subscription(() => Message, {
    topics: PUBSUB_NEW_MESSAGE,
    filter: ({ payload, args }: FilterOptions) => {
      const { chat, senderId } = payload.newMessage;

      // Only send to the users that are apart of this chat
      // and that are not the user that originally sent the msg
      for (const user of chat.users) {
        if (user.id !== senderId && user.id === args.userId) {
          return true;
        }
      }

      return false;
    },
  })
  newMessage(
    @Root() payload: NewMessagePayload,
    @Arg("userId", () => Number) _userId: number
  ): Message {
    return payload.newMessage;
  }
}
