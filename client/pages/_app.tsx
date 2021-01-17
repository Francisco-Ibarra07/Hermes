import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { IsLoggedInQuery, LoginDocument, LoginMutation } from "../generated/graphql";

function updateQueryWrapper<Result, Query>(
  result: any,
  cache: Cache,
  input: QueryInput,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(input, (data) => fn(result, data as any) as any);
}

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
          loginUser: (_result, args, cache) => {
            updateQueryWrapper<LoginMutation, IsLoggedInQuery>(
              _result,
              cache,
              { query: LoginDocument },
              (result, query) => {
                console.log("result: ", result);
                console.log("query: ", query);
                if (result.loginUser.errors) {
                  return query;
                } else {
                  return {
                    isLoggedIn: result.loginUser.user,
                  };
                }
              }
            );
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
