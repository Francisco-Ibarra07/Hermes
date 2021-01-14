import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, ButtonGroup, Flex, Spinner, Text } from "@chakra-ui/react";
import { useIsLoggedInQuery } from "../generated/graphql";

function NavBar() {
  const [{ data, fetching }] = useIsLoggedInQuery();
  let navLinks;

  // Loading
  if (fetching) {
    console.log("fetching");
    return <Spinner />;
  }
  // Isn't logged in
  else if (!data?.isLoggedIn) {
    console.log("Not logged in: ", data);
    navLinks = (
      <>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Signup</Button>
        </Link>
      </>
    );
  }
  // Logged in
  else {
    console.log("Already logged in", data);
    navLinks = <Button>Logout</Button>;
  }

  return (
    <Box>
      <Flex my={15} mx={150} justify="space-between">
        <Link href="/">
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
            {navLinks}
          </ButtonGroup>
        </Flex>
      </Flex>
    </Box>
  );
}

export default NavBar;
