import { Flex, Heading } from "@chakra-ui/react";
import FeatureDesc from "../components/FeatureDesc";

function LandingFeatures() {
  return (
    <Flex h="60vh" align="center" justify="center">
      <Flex mx={150} h="75%" w="100%" flexDir="column" align="center">
        {/* Title */}
        <Heading as="h2" size="xl" mb={14}>
          Features
        </Heading>

        {/* 3 Feature Boxes */}
        <Flex w={3 / 4} h="75%" align="center" justify="space-between">
          <FeatureDesc
            h={40}
            w={40}
            label="Chat"
            iconSrc="/images/chat-icon.webp"
            description="Send messages to each other"
          />

          <FeatureDesc
            h={40}
            w={40}
            label="Video"
            iconSrc="/images/video-icon.png"
            description="Video chat with your friends"
          />

          <FeatureDesc
            h={40}
            w={40}
            label="Search"
            iconSrc="/images/search-icon.png"
            description="Forget something? Search through past history messages"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LandingFeatures;
