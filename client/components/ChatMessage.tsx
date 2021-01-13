import { Flex, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface ChatMessageProps {
  bg: string;
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
      <Flex bg={props.bg} p={3} maxW="70%" borderRadius="2xl" align="center">
        <Text>{props.children}</Text>
      </Flex>
    </Flex>
  );
};

export default ChatMessage;
