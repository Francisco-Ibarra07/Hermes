import {
  Button,
  Flex,
  Text,
  Textarea,
  Image as ChakraImage,
  Heading,
  Box,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import FriendCard from "../components/FriendCard";
import {
  useGetChatsQuery,
  useIsLoggedInQuery,
  useMessagesQuery,
  useCreateMessageMutation,
} from "../generated/graphql";

const app = () => {
  const activeChatIdRef = useRef(-1);
  const [textareaValue, setTextareaValue] = useState("");
  const [activeCardNum, setActiveCardNum] = useState(0);
  const [{ data: userData }] = useIsLoggedInQuery();
  const [{ fetching: fetchingChats, data: chatsData }] = useGetChatsQuery();
  const [{ fetching: fetchingMessages, data: messagesData }] = useMessagesQuery({
    variables: {
      chatId: activeChatIdRef.current,
    },
    pause: fetchingChats || activeChatIdRef.current == -1,
  });
  const [{ fetching: fetchingCreateMessage }, createMessage] = useCreateMessageMutation();

  const onFriendCardClick = (key: number, chatId: number) => {
    setActiveCardNum(key);
    activeChatIdRef.current = chatId;
  };

  const fillFriendsWithMockData = (count: number) => {
    let list = [];
    for (let i = 0; i < count; i++) {
      list.push(
        <FriendCard
          key={i}
          cardKey={i}
          chatId={-1}
          name="John Smith"
          caption="Last message on: 10/20/20"
          isActive={i == activeCardNum}
          onClickHandler={onFriendCardClick}
        />
      );
    }

    return list;
  };

  const fillFriends = () => {
    // Map through chat list and return FriendCard's for each one
    let list = chatsData?.chats.map((chat, index) => {
      // Format the date
      const date = new Date(parseInt(chat.updatedAt));
      const formattedDate = date.toLocaleString();

      // Once chat list is loaded for the first time, set active
      // chat id to fetch messages of the first friend card
      if (activeChatIdRef.current === -1 && index === 0) {
        activeChatIdRef.current = chat.id;
        setActiveCardNum(0);
      }

      // Build a FriendCard for this chat
      return (
        <FriendCard
          key={index}
          cardKey={index}
          chatId={chat.id}
          name={chat.users.length !== 0 ? chat.users[0].name : `chat-${index}`}
          caption={`Last message on: ${formattedDate}`}
          isActive={index == activeCardNum}
          onClickHandler={onFriendCardClick}
        />
      );
    });

    return list;
  };

  const fillMessagesWithMockData = (count: number) => {
    let list = [];
    for (let i = 0; i < count; i++) {
      list.push(
        <ChatMessage key={`msg-${i}`} isFirst={i == 0} alignRight={i % 2 == 0}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit
          amet, consectetur adipiscing elit, sed do eiusmod tempor
        </ChatMessage>
      );
    }

    return list;
  };

  const fillMessages = () => {
    if (fetchingChats || fetchingMessages) {
      return <Spinner />;
    }

    let list = messagesData?.getMessages.map((msg, index) => {
      return (
        <ChatMessage
          key={`msg-${index}`}
          isFirst={index == 0}
          alignRight={msg.senderId === userData?.isLoggedIn?.id}
        >
          {msg.content}
        </ChatMessage>
      );
    });

    return list;
  };

  const fillActiveRecieverSection = () => {
    let recieverName;
    let imageUrl;
    if (!userData?.isLoggedIn) {
      recieverName = "John Smith";
      imageUrl = "/images/avatar-icon.png";
    } else if (chatsData?.chats.length === 0) {
      return "";
    } else {
      recieverName = chatsData?.chats[activeCardNum].users[0].name;
      imageUrl = "/images/avatar-icon.png";
    }

    return (
      <>
        {/* Image + Name of person currently talking to */}
        <Flex align="center" justify="center">
          <Image src={imageUrl} alt="avatar" width={50} height={50} />
          <Text ml={3} fontSize="2xl">
            {recieverName}
          </Text>
        </Flex>

        {/* Start call button */}
        <Flex align="center" justify="center">
          <Button variant="outline" colorScheme="blue">
            Start Video Call
          </Button>
        </Flex>
      </>
    );
  };

  const handleTextAreaSubmit = async () => {
    if (textareaValue === "") return;
    console.log("Creating message: \n\n", textareaValue);
    const response = await createMessage({
      chatId: activeChatIdRef.current,
      content: textareaValue,
      messageType: "text",
    });

    if (response.error) {
      console.log(response.error);
    }
    // Add new message to our list
    else if (response.data?.createMessage) {
      const messageAdded = response.data?.createMessage;
      messagesData?.getMessages.unshift(messageAdded);
      setTextareaValue("");
    }
  };

  if (fetchingChats) {
    return <Spinner />;
  }

  return (
    <Flex h="100vh">
      {/* Left Tab */}
      <Flex w="20%" h="100%" flexDir="column">
        {/* User Icon + Chats + MySettings + AddFriend */}
        <Flex h="7%" mx={2} align="center" justify="space-between">
          {/* User Icon + Chats*/}
          <Flex align="center" justify="center">
            <ChakraImage src="/images/avatar-icon.png" alt="avatar" boxSize={30} />
            <Heading as="h1" size="md" ml={2}>
              Chats
            </Heading>
          </Flex>
          {/* Settings + Add Friend */}
          <Flex align="center" justify="center">
            {/* TODO: Consider replacing these with 'react-icons' library */}
            <ButtonGroup spacing={1}>
              <Box as="button">
                <ChakraImage src="/images/settings-icon.png" alt="settings" boxSize={30} />
              </Box>
              <Box as="button">
                <ChakraImage src="/images/add-friend-icon.png" alt="add-friend" boxSize={30} />
              </Box>
            </ButtonGroup>
          </Flex>
        </Flex>

        {/* Search Bar */}
        <Flex h="7%" mx={5} align="center" justify="center">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<ChakraImage src="/images/search-icon.png" alt="search" boxSize={30} />}
            />
            <Input type="text" placeholder="Search messages" />
          </InputGroup>
        </Flex>

        {/* Friends List */}
        <Flex h="86%" flexDir="column" overflow="hidden" _hover={{ overflow: "auto" }}>
          {/* Friend Card */}
          {userData?.isLoggedIn ? fillFriends() : fillFriendsWithMockData(15)}
        </Flex>
      </Flex>

      {/* Right Tab */}
      <Flex w="80%" h="100%" flexDir="column">
        {/* Name of reciever + Start Call */}
        <Flex h="10%" p={5} border="1px" align="center" justify="space-between">
          {fillActiveRecieverSection()}
        </Flex>

        {/* Main Messages */}
        <Flex h="80%" border="1px" align="center" justify="center">
          <Stack
            h="100%"
            w="100%"
            px={5}
            spacing={5}
            overflow="auto"
            display="flex"
            flexDir="column-reverse"
          >
            {userData?.isLoggedIn ? fillMessages() : fillMessagesWithMockData(10)}
          </Stack>
        </Flex>

        {/* Typing area */}
        <Flex h="10%" p={5} border="1px" align="center">
          <Textarea
            size="md"
            resize="none"
            value={textareaValue}
            placeholder="Type message here"
            onChange={(e) => setTextareaValue(e.target.value)}
          />
          <Button
            ml={5}
            colorScheme="blue"
            isDisabled={fetchingChats || fetchingMessages}
            isLoading={fetchingCreateMessage}
            onClick={handleTextAreaSubmit}
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default app;
