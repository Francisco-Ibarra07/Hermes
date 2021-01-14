import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, ButtonGroup, Flex, Spinner, Text } from "@chakra-ui/react";
import { useIsLoggedInQuery, useLogoutMutation } from "../generated/graphql";

function NavBar() {
  const [{ data, fetching }] = useIsLoggedInQuery();
  const [{ fetching: logoutFetch }, logoutUser] = useLogoutMutation();
  let navLinks;

  // Loading
  if (fetching) {
    return <Spinner />;
  }
  // Isn't logged in
  else if (!data?.isLoggedIn) {
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
    navLinks = (
      <Button isLoading={logoutFetch} onClick={() => logoutUser()}>
        Logout
      </Button>
    );
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
