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
import { useSignupMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface SignupFormValues {
  email: string;
  password: string;
}

const Signup = () => {
  const [{}, signupUser] = useSignupMutation();
  const router = useRouter();

  const handleFormSubmit = async (
    values: SignupFormValues,
    actions: FormikHelpers<SignupFormValues>
  ) => {
    const response = await signupUser(values);
    actions.setSubmitting(false);

    // Check for form errors
    if (response.data?.signupUser.errors) {
      // actions.setErrors({
      // });
    }
    // Successful login
    else if (response.data?.signupUser.user) {
      router.push("/app");
    }
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

                  <Field name="email">
                    {(props: FieldProps) => (
                      <FormControl my={5}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...props.field} id="email" placeholder="email" type="email" />
                        <FormErrorMessage>{props.form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field type="password" name="password">
                    {(props: FieldProps) => (
                      <FormControl my={5}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          {...props.field}
                          id="password"
                          placeholder="password"
                          type="password"
                        />
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
