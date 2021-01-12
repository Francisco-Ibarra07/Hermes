import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import Image from "next/image";
import FriendCard from "../components/FriendCard";

const app = () => {
  const fillFriends = (count: number) => {
    let list = [];
    for (let i = 0; i < count; i++) {
      list.push(<FriendCard key={`friendcard-${i}`} />);
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
      <Flex bg="purple.100" w="19%" h="100%" flexDir="column">
        {/* User Icon + Name + MySettings + AddFriend */}
        <Flex bg="teal.100" h="10%">
          User Icon + Name + MySettings + AddFriend
        </Flex>

        {/* Search Bar */}
        <Flex bg="yellow.100" h="10%">
          Search Bar
        </Flex>

        {/* Friends List */}
        <Flex bg="pink.100" h="80%" flexDir="column" overflow="auto">
          {/* Friend Card */}
          {fillFriends(15)}
        </Flex>
      </Flex>

      {/* Right Tab */}
      <Flex w="81%" h="100%" p={1} flexDir="column">
        {/* Top */}
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
          <Flex h="100%" w="100%" overflow="auto" flexDir="column-reverse">
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
