import { Flex, Button, Text, Image as ChakraImage } from "@chakra-ui/react";
import React, { useState } from "react";

interface FriendCardProps {
  name: string;
  chatId: number;
  caption: string;
  cardKey: number;
  isActive?: boolean;
  onClickHandler: (key: number, chatId: number) => void;
}

function FriendCard(props: FriendCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Flex
      p={2}
      w="100%"
      h="80px"
      minH="80px"
      cursor="pointer"
      bg={props.isActive ? "gray.200" : ""}
      _hover={!props.isActive ? { bg: "gray.100" } : {}}
      align="center"
      justify="space-between"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => props.onClickHandler(props.cardKey, props.chatId)}
    >
      <Flex w="100%" align="center" justify="space-between">
        <Flex w="100%">
          <ChakraImage src="/images/avatar-icon.png" alt="avatar" boxSize={30} />
          <Flex ml={2} maxW="80%" flexDir="column" justify="center">
            <Text fontSize="sm" isTruncated>
              {props.name}
            </Text>
            <Text fontSize="xs" isTruncated>
              {props.caption}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          {isHovering ? (
            <Button colorScheme="blue" variant="outline" size="sm" borderRadius="xl">
              ...
            </Button>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default FriendCard;
