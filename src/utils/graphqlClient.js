import { createClient, dedupExchange, cacheExchange, fetchExchange, makeOperation } from "urql";
import { authExchange } from "@urql/exchange-auth";

export const graphQLClient = createClient({
  url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      addAuthToOperation({ operation }) {
        // if clientName does not exist, we return operation without modifications
        if (!operation.context.clientName) {
          return operation;
        }

        const { clientName, fetchOptions } = operation.context;
        const options = typeof fetchOptions === "function" ? fetchOptions() : fetchOptions ?? {};

        switch (clientName) {
          case "aurora": {
            const context = {
              ...operation.context,
              url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
              fetchOptions: {
                ...options,
              },
            };

            return makeOperation(operation.kind, operation, context);
          }
          default: {
            return operation;
          }
        }
      },
      getAuth: async () => {},
    }),
    fetchExchange,
  ],
});

export const graphQLClientPolygon = createClient({
  url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      addAuthToOperation({ operation }) {
        // if clientName does not exist, we return operation without modifications
        if (!operation.context.clientName) {
          return operation;
        }

        const { clientName, fetchOptions } = operation.context;
        const options = typeof fetchOptions === "function" ? fetchOptions() : fetchOptions ?? {};

        switch (clientName) {
          case "polygon": {
            const context = {
              ...operation.context,
              url:
                process.env.REACT_APP_ENV_STAGING === "true"
                  ? "https://api.thegraph.com/subgraphs/name/prometheo/playdrop"
                  : "https://api.thegraph.com/subgraphs/name/prometheo/polygon-mainnet",
              fetchOptions: {
                ...options,
              },
            };
            return makeOperation(operation.kind, operation, context);
          }
          default: {
            return operation;
          }
        }
      },
      getAuth: async () => {},
    }),
    fetchExchange,
  ],
});

export const polygonClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/playdrop"
      : "https://api.thegraph.com/subgraphs/name/prometheo/polygon-mainnet",
});

export const celoClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/celo-dev-subgraph"
      : "https://api.thegraph.com/subgraphs/name/prometheo/celo-mainnet",
});

export const auroraClient = createClient({
  url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
});
