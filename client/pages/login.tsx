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
import { toErrorMap } from "../utils/toErrorMap";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [{}, loginUser] = useLoginMutation();
  const router = useRouter();

  const handleFormSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    // Send credentials to graphql server
    const response = await loginUser(values);
    actions.setSubmitting(false);

    // Api is down
    if (response.error?.networkError) {
      actions.setErrors({
        password: "Service is currently unavailable",
      });
    }
    // Check for errors returned
    else if (response.data?.loginUser.errors) {
      actions.setErrors(toErrorMap(response.data.loginUser.errors));
    }
    // Successful login
    else if (response.data?.loginUser.user) {
      router.push("/app");
    }
  };

  return (
    <Box>
      <NavBar />

      <Flex mt="200px" align="center" justify="center">
        <Flex w="40%" h="50%" p={5} border="1px" borderRadius="md" boxShadow="lg" flexDir="column">
          <Formik initialValues={{ email: "", password: "" }} onSubmit={handleFormSubmit}>
            {(props: FormikProps<LoginFormValues>) => (
              <Form>
                <Flex flexDir="column" align="center">
                  <Heading as="h1" size="xl" my={5}>
                    Login
                  </Heading>

                  <Field name="email">
                    {(props: FieldProps) => (
                      <FormControl
                        my={5}
                        isInvalid={!!props.form.errors.email && !!props.form.touched.email}
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...props.field} id="email" placeholder="email" type="email" />
                        <FormErrorMessage>{props.form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="password">
                    {(props: FieldProps) => (
                      <FormControl
                        my={5}
                        isInvalid={!!props.form.errors.password && !!props.form.touched.password}
                      >
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

export default Login;
