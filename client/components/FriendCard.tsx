import { Flex, Button, Text, Image as ChakraImage } from "@chakra-ui/react";
import React, { useState } from "react";

function FriendCard() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Flex
      p={2}
      w="100%"
      h="80px"
      minH="80px"
      border="1px"
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      align="center"
      justify="space-between"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Flex w="85%" align="center">
        <ChakraImage src="/images/avatar-icon.png" alt="avatar" boxSize={30} />
        <Flex ml={2} maxW="80%" flexDir="column" justify="center">
          <Text fontSize="sm">John Smith</Text>
          <Text fontSize="xs" isTruncated>
            You: Last message text a very long message indeed
          </Text>
        </Flex>
      </Flex>
      {isHovering ? (
        <Button colorScheme="blue" variant="outline" size="sm" borderRadius="xl">
          ...
        </Button>
      ) : null}
    </Flex>
  );
}

export default FriendCard;
