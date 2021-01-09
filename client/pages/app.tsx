import { Box, Flex } from "@chakra-ui/react";

const app = () => (
  <Flex bg="blue.100" h="100vh">
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
    <Flex bg="red.100" w="81%" h="100%" flexDir="column">
      {/* Top */}
      <Flex bg="red.200" h="10%" align="center" justify="space-between">
        <Box>Image + Name of person currently talking to</Box>

        <Box>Start call icons</Box>
      </Flex>

      {/* Main Messages */}
      <Flex bg="green.200" h="80%">
        Main messages
      </Flex>

      {/* Typing area */}
      <Flex bg="blue.200" h="10%">
        Typing section
      </Flex>
    </Flex>
  </Flex>
);

export default app;
