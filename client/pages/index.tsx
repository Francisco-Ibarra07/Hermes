import { Box, Button, Flex, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import Image from "next/image";
import NavBar from "../components/NavBar";

const Index = () => (
  <Box>
    <NavBar />

    {/* Hero */}
    <Box h="89vh">
      <Flex mx={150} h="100%" align="center" justify="center">
        {/* Hero Text */}
        <Box maxW="40rem">
          <Heading as="h1" size="2xl">
            Real-time messaging and video calling platform
          </Heading>
          <Button size="lg" mt={8} variant="outline">
            Get started for free
          </Button>
        </Box>

        <Flex ml="10" flexDir="column" align="center">
          <Image src="/images/hero-image.svg" alt="demo img" width={480} height={367} />
          <Text>
            *Random placeholder image. Credit to{" "}
            <ChakraLink isExternal href="https://mikro-orm.io/img/hp-example.svg">
              mikro-orm.io
            </ChakraLink>
          </Text>
        </Flex>
      </Flex>
    </Box>
  </Box>
);

export default Index;
