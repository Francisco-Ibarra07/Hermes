import { Box, Flex, Heading, Button, Text, Link as ChakraLink } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <Box h="89vh">
      <Flex mx={150} h="100%" align="center" justify="center">
        {/* Hero Text */}
        <Box maxW="40rem">
          <Heading as="h1" size="2xl">
            Real-time messaging and video calling platform
          </Heading>
          <Link href="#">
            <Button size="lg" mt={8} variant="outline">
              Get started for free
            </Button>
          </Link>
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
  );
}

export default Hero;
