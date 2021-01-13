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
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import FriendCard from "../components/FriendCard";

const app = () => {
  const [activeCardNum, setActiveCardNum] = useState(0);

  const onFriendCardClick = (key: number) => {
    setActiveCardNum(key);
  };

  const fillFriends = (count: number) => {
    let list = [];
    for (let i = 0; i < count; i++) {
      list.push(
        <FriendCard
          key={i}
          cardKey={i}
          isActive={i == activeCardNum}
          onClickHandler={onFriendCardClick}
        />
      );
    }

    return list;
  };

  const fillMessages = (count: number) => {
    let list = [];
    for (let i = 0; i < count; i++) {
      list.push(
        <Text key={`msg-${i}`} textAlign={i % 2 == 0 ? "left" : "right"}>
          message-{i}
        </Text>
      );
    }

    return list;
  };

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
          {fillFriends(15)}
        </Flex>
      </Flex>

      {/* Right Tab */}
      <Flex w="80%" h="100%" flexDir="column">
        {/* Name of reciever + Start Call */}
        <Flex h="10%" p={5} border="1px" align="center" justify="space-between">
          {/* Image + Name of person currently talking to */}
          <Flex align="center" justify="center">
            <Image src="/images/avatar-icon.png" alt="avatar" width={50} height={50} />
            <Text ml={3} fontSize="2xl">
              John Smith
            </Text>
          </Flex>

          {/* Start call button */}
          <Flex align="center" justify="center">
            <Button variant="outline" colorScheme="blue">
              Start Video Call
            </Button>
          </Flex>
        </Flex>

        {/* Main Messages */}
        <Flex h="80%" p={5} border="1px" align="center" justify="center">
          <Flex
            h="100%"
            w="100%"
            overflow="hidden"
            _hover={{ overflow: "auto" }}
            flexDir="column-reverse"
          >
            {fillMessages(40)}
          </Flex>
        </Flex>

        {/* Typing area */}
        <Flex h="10%" p={5} border="1px" align="center">
          <Textarea placeholder="Type message here" size="md" resize="none" />
          <Button ml={5} colorScheme="blue">
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default app;
