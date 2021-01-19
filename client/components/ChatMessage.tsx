import { Flex, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface ChatMessageProps {
  isFirst: boolean;
  alignRight: boolean;
}

const ChatMessage: FunctionComponent<ChatMessageProps> = (props) => {
  return (
    // Row
    <Flex
      mt={props.isFirst ? 5 : 0}
      mb={props.isFirst ? 2 : 0}
      align="center"
      justify={props.alignRight ? "flex-end" : "flex-start"}
    >
      {/* Bubble */}
      <Flex
        bg={props.alignRight ? "blue.200" : "gray.200"}
        p={3}
        maxW="70%"
        borderRadius="2xl"
        align="center"
      >
        <Text maxW="100%">{props.children}</Text>
      </Flex>
    </Flex>
  );
};

export default ChatMessage;
