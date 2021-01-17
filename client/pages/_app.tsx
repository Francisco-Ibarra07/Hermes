import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Data } from "@urql/exchange-graphcache";
import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  LoginMutation,
  SignupMutation,
} from "../generated/graphql";

const client = createClient({
  url: "http://localhost:5000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          loginUser: (result, _args, cache) => {
            cache.updateQuery({ query: IsLoggedInDocument }, (data) => {
              // Workaround: typecast to get strict typing on this function
              const cResult = result as LoginMutation;
              if (cResult.loginUser.errors) {
                return data;
              }

              // Store user object in 'isLoggedIn' query
              const cData = data as IsLoggedInQuery;
              cData.isLoggedIn = cResult.loginUser.user;

              return cData as Data;
            });
          },
          signupUser: (result, _args, cache) => {
            cache.updateQuery({ query: IsLoggedInDocument }, (data) => {
              // Workaround: typecast to get strict typing on this function
              const cResult = result as SignupMutation;
              if (cResult.signupUser.errors) {
                return data;
              }

              // Store user object in 'isLoggedIn' query
              const cData = data as IsLoggedInQuery;
              cData.isLoggedIn = cResult.signupUser.user;

              return cData as Data;
            });
          },
          logoutUser: (_result, _args, cache) => {
            cache.updateQuery({ query: IsLoggedInDocument }, (data) => {
              // Reset 'isLoggedIn' back to null
              const cData = data as IsLoggedInQuery;
              cData.isLoggedIn = null;

              return cData as Data;
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <title>Hermes Messenger</title>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
