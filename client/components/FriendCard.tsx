import { Flex, Button, Text, Image as ChakraImage } from "@chakra-ui/react";
import React from "react";

function FriendCard() {
  return (
    <Flex w="100%" h="80px" minH="80px" p={2} border="1px" align="center" justify="space-between">
      <Flex w="85%" align="center">
        <ChakraImage src="/images/avatar-icon.png" alt="avatar" boxSize={30} />
        <Flex ml={2} maxW="80%" flexDir="column" justify="center">
          <Text fontSize="sm">John Smith</Text>
          <Text fontSize="xs" isTruncated>
            You: Last message text a very long message indeed
          </Text>
        </Flex>
      </Flex>
      <Button borderRadius="xl">...</Button>
    </Flex>
  );
}

export default FriendCard;
