import { Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/LandingFeatures";

const Index = () => (
  <Box>
    <NavBar />

    <LandingHero />

    <LandingFeatures />
  </Box>
);

export default Index;
