import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import Image from "next/image";

const app = () => (
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
      <Flex bg="pink.100" h="80%">
        Friends List
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
        Main messages
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

export default app;
