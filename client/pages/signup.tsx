import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from "formik";
import NavBar from "../components/NavBar";

interface SignupFormValues {
  email: string;
  password: string;
}

const Signup = () => {
  const handleFormSubmit = (values: SignupFormValues, actions: FormikHelpers<SignupFormValues>) => {
    console.log("Signup");
    console.log(values, actions);

    setTimeout(() => {
      actions.setSubmitting(false);
    }, 500);
  };

  return (
    <Box>
      <NavBar />

      <Flex mt="200px" align="center" justify="center">
        <Flex w="40%" h="50%" p={5} border="1px" borderRadius="md" boxShadow="lg" flexDir="column">
          <Formik initialValues={{ email: "", password: "" }} onSubmit={handleFormSubmit}>
            {(props: FormikProps<SignupFormValues>) => (
              <Form>
                <Flex flexDir="column" align="center">
                  <Heading as="h1" size="xl" my={5}>
                    Signup
                  </Heading>

                  <Field type="email" name="email">
                    {(props: FieldProps) => (
                      <FormControl my={5}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...props.field} id="email" placeholder="email" />
                        <FormErrorMessage>{props.form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field type="password" name="password">
                    {(props: FieldProps) => (
                      <FormControl my={5}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input {...props.field} id="password" placeholder="password" />
                        <FormErrorMessage>{props.form.errors.password}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Button type="submit" isLoading={props.isSubmitting} my={5}>
                    Submit
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Signup;
