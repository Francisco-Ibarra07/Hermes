import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { Provider, dedupExchange, fetchExchange, subscriptionExchange, Client } from "urql";
import { cacheExchange, Data } from "@urql/exchange-graphcache";
import {
  IsLoggedInDocument,
  IsLoggedInQuery,
  LoginMutation,
  SignupMutation,
} from "../generated/graphql";
import { SubscriptionClient } from "subscriptions-transport-ws";

let urqlClient: Client;

if (process.browser) {
  const subscriptionClient = new SubscriptionClient("ws://localhost:5000/graphql", {
    reconnect: true,
  });

  urqlClient = new Client({
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
      subscriptionExchange({
        forwardSubscription(operation) {
          return subscriptionClient.request(operation);
        },
      }),
    ],
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider
      value={urqlClient ? urqlClient : new Client({ url: "http://localhost:5000/graphql " })}
    >
      <title>Hermes Messenger</title>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
