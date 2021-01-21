import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  isLoggedIn?: Maybe<User>;
  chats: Array<Chat>;
  getMessages: Array<Message>;
};


export type QueryGetMessagesArgs = {
  chatId: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  screenName: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Chat = {
  __typename?: 'Chat';
  id: Scalars['Float'];
  chatType: Scalars['String'];
  users: Array<User>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['Float'];
  messageType: Scalars['String'];
  content: Scalars['String'];
  senderId: Scalars['Float'];
  chatId: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signupUser: UserResponse;
  loginUser: UserResponse;
  logoutUser: Scalars['Boolean'];
  createChat: Chat;
  createMessage: Message;
};


export type MutationSignupUserArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationLoginUserArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCreateChatArgs = {
  screenNames: Array<Scalars['String']>;
};


export type MutationCreateMessageArgs = {
  content: Scalars['String'];
  messageType: Scalars['String'];
  chatId: Scalars['Float'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: Message;
};


export type SubscriptionNewMessageArgs = {
  userId: Scalars['Float'];
};

export type MessageFieldsFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'messageType' | 'senderId' | 'content' | 'chatId' | 'updatedAt'>
);

export type UserFieldsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'screenName' | 'email'>
);

export type CreateMessageMutationVariables = Exact<{
  chatId: Scalars['Float'];
  messageType: Scalars['String'];
  content: Scalars['String'];
}>;


export type CreateMessageMutation = (
  { __typename?: 'Mutation' }
  & { createMessage: (
    { __typename?: 'Message' }
    & MessageFieldsFragment
  ) }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { loginUser: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserFieldsFragment
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logoutUser'>
);

export type SignupMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
}>;


export type SignupMutation = (
  { __typename?: 'Mutation' }
  & { signupUser: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & UserFieldsFragment
    )> }
  ) }
);

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = (
  { __typename?: 'Query' }
  & { chats: Array<(
    { __typename?: 'Chat' }
    & Pick<Chat, 'id' | 'chatType' | 'createdAt' | 'updatedAt'>
    & { users: Array<(
      { __typename?: 'User' }
      & UserFieldsFragment
    )> }
  )> }
);

export type IsLoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type IsLoggedInQuery = (
  { __typename?: 'Query' }
  & { isLoggedIn?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export type MessagesQueryVariables = Exact<{
  chatId: Scalars['Float'];
}>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { getMessages: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'chatId' | 'senderId' | 'messageType' | 'content' | 'updatedAt'>
  )> }
);

export type NewMessageSubscriptionVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type NewMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newMessage: (
    { __typename?: 'Message' }
    & MessageFieldsFragment
  ) }
);

export const MessageFieldsFragmentDoc = gql`
    fragment MessageFields on Message {
  id
  messageType
  senderId
  content
  chatId
  updatedAt
}
    `;
export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  id
  name
  screenName
  email
}
    `;
export const CreateMessageDocument = gql`
    mutation CreateMessage($chatId: Float!, $messageType: String!, $content: String!) {
  createMessage(chatId: $chatId, messageType: $messageType, content: $content) {
    ...MessageFields
  }
}
    ${MessageFieldsFragmentDoc}`;

export function useCreateMessageMutation() {
  return Urql.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument);
};
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logoutUser
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const SignupDocument = gql`
    mutation Signup($email: String!, $password: String!, $name: String!) {
  signupUser(email: $email, password: $password, name: $name) {
    errors {
      field
      message
    }
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;

export function useSignupMutation() {
  return Urql.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument);
};
export const GetChatsDocument = gql`
    query getChats {
  chats {
    id
    chatType
    createdAt
    updatedAt
    users {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;

export function useGetChatsQuery(options: Omit<Urql.UseQueryArgs<GetChatsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetChatsQuery>({ query: GetChatsDocument, ...options });
};
export const IsLoggedInDocument = gql`
    query isLoggedIn {
  isLoggedIn {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

export function useIsLoggedInQuery(options: Omit<Urql.UseQueryArgs<IsLoggedInQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<IsLoggedInQuery>({ query: IsLoggedInDocument, ...options });
};
export const MessagesDocument = gql`
    query messages($chatId: Float!) {
  getMessages(chatId: $chatId) {
    id
    chatId
    senderId
    messageType
    content
    updatedAt
  }
}
    `;

export function useMessagesQuery(options: Omit<Urql.UseQueryArgs<MessagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MessagesQuery>({ query: MessagesDocument, ...options });
};
export const NewMessageDocument = gql`
    subscription NewMessage($userId: Float!) {
  newMessage(userId: $userId) {
    ...MessageFields
  }
}
    ${MessageFieldsFragmentDoc}`;

export function useNewMessageSubscription<TData = NewMessageSubscription>(options: Omit<Urql.UseSubscriptionArgs<NewMessageSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NewMessageSubscription, TData>) {
  return Urql.useSubscription<NewMessageSubscription, TData, NewMessageSubscriptionVariables>({ query: NewMessageDocument, ...options }, handler);
};