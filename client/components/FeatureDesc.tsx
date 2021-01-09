import { Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";

interface FeatureDescProps {
  h: number;
  w: number;
  label: string;
  iconSrc: string;
  description: string;
}

function FeatureDesc(props: FeatureDescProps) {
  return (
    <Flex
      p={3}
      w="300px"
      h="100%"
      border="1px"
      borderRadius="lg"
      boxShadow="2xl"
      textAlign="center"
      flexDir="column"
      align="center"
      justify="space-evenly"
    >
      <Image src={props.iconSrc} alt={props.label} width={props.w} height={props.h} />
      <Heading as="h3" size="lg">
        {props.label}
      </Heading>
      <Text>{props.description}</Text>
    </Flex>
  );
}

export default FeatureDesc;
