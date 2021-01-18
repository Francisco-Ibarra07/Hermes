import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from "typeorm";
import { Chat } from "./Chat";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  messageType!: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  senderId: number;

  @Field()
  @Column()
  chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
