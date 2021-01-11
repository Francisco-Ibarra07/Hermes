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
import { Field, FieldProps, Form, FormikErrors, FormikProps, withFormik } from "formik";

interface FormValues {
  email: string;
  password: string;
}

interface FormProps {
  title: string;
}

const InnerForm = (props: FormikProps<FormValues> & FormProps) => {
  const { touched, errors, isSubmitting, title } = props;

  return (
    <Form>
      <Heading as="h1" size="xl">
        {title}
      </Heading>

      <Field type="email" name="email">
        {(props: FieldProps) => (
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input {...props.field} id="email" placeholder="email" />
            <FormErrorMessage>{props.form.errors.email}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <Field type="password" name="password">
        {(props: FieldProps) => (
          <FormControl>
            <FormLabel htmlFor="password">Email</FormLabel>
            <Input {...props.field} id="password" placeholder="password" />
            <FormErrorMessage>{props.form.errors.password}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      {touched.email && errors.email && <Box>{errors.email}</Box>}

      <Button type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </Form>
  );
};

interface SignupFormProps {
  title: string;
}

const SignupForm = withFormik<SignupFormProps, FormValues>({
  validate: (values: FormValues) => {
    let errors: FormikErrors<FormValues> = {};
    if (!values.email) {
      errors.email = "Required";
    }

    return errors;
  },

  handleSubmit: (values: FormValues) => {
    console.log("Values: ", values);
  },
})(InnerForm);

const Signup = () => (
  <Flex h="100vh" align="center" justify="center">
    <Flex
      w="40%"
      h="50%"
      p={5}
      border="1px"
      borderRadius="md"
      boxShadow="lg"
      flexDir="column"
      align="center"
    >
      <SignupForm title="Signup" />
    </Flex>
  </Flex>
);

export default Signup;
