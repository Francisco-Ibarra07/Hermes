import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, ButtonGroup, Flex, Text } from "@chakra-ui/react";

function NavBar() {
  return (
    <Box>
      <Flex my={15} mx={150} justify="space-between">
        <Link href="#">
          <Flex
            align="center"
            justify="center"
            p={1}
            as="button"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <Image src="/images/winged-shoe-icon.png" alt="hermes logo" width={70} height={70} />
            <Flex alignItems="center" justifyContent="center">
              <Text fontSize="4xl">Hermes</Text>
            </Flex>
          </Flex>
        </Link>

        <Flex align="center" justify="center">
          <ButtonGroup ml={2} variant="outline">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Signup</Button>
            </Link>
          </ButtonGroup>
        </Flex>
      </Flex>
    </Box>
  );
}

export default NavBar;
